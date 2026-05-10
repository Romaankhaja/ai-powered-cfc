import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

const root = process.cwd()
const backendDir = path.join(root, 'backend')
const frontendDir = path.join(root, 'frontend')
const venvPython = path.join(root, '.venv', 'Scripts', 'python.exe')
const pythonBin = fs.existsSync(venvPython) ? venvPython : 'python'
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const children = []

function resolveCommand(command, args, useShell) {
  if (process.platform === 'win32' && command === npmBin && !useShell) {
    return {
      command: 'cmd.exe',
      args: ['/c', npmBin, ...args],
      shell: false,
    }
  }

  return { command, args, shell: useShell }
}

function launch(label, command, args, cwd, useShell = false) {
  const resolved = resolveCommand(command, args, useShell)
  const child = spawn(resolved.command, resolved.args, {
    cwd,
    stdio: 'inherit',
    shell: resolved.shell,
    env: process.env,
  })

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== null) {
      console.error(`[${label}] exited with signal ${signal}`)
    }
    if (code !== 0) {
      shutdown(code ?? 1)
    }
  })

  child.on('error', (error) => {
    console.error(`[${label}] failed to start:`, error.message)
    shutdown(1)
  })

  children.push(child)
  return child
}

function run(label, command, args, cwd, useShell = false, extraEnv = {}) {
  const resolved = resolveCommand(command, args, useShell)
  return new Promise((resolve, reject) => {
    const child = spawn(resolved.command, resolved.args, {
      cwd,
      stdio: 'inherit',
      shell: resolved.shell,
      env: {
        ...process.env,
        ...extraEnv,
      },
    })

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`${label} exited with code ${code ?? 'null'}${signal ? ` signal ${signal}` : ''}`))
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

let shuttingDown = false

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }

  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

async function main() {
  const buildIdPath = path.join(frontendDir, '.next', 'BUILD_ID')
  if (!fs.existsSync(buildIdPath)) {
    console.log('Building CarbonIQ frontend...')
    const legacyNodeOptions = process.env.NODE_OPTIONS
      ? `${process.env.NODE_OPTIONS} --openssl-legacy-provider`
      : '--openssl-legacy-provider'

    await run(
      'frontend-build',
      npmBin,
      ['run', 'build'],
      frontendDir,
      { NODE_OPTIONS: legacyNodeOptions },
    )
  } else {
    console.log('Reusing existing frontend build output...')
  }

  console.log('Starting CarbonIQ backend on :8000 and frontend on :3000...')
  launch('backend', pythonBin, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], backendDir)
  launch('frontend', npmBin, ['run', 'start'], frontendDir)
}

main().catch((error) => {
  console.error(error.message)
  shutdown(1)
})
