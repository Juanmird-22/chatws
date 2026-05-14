import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

function App(){
  const socketRef = useRef(null)
  const inputRef = useRef(null)
  const nameRef = useRef(null)
  const [nombre, setNombre] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [conectado, setConectado] = useState(false)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    socketRef.current = io('http://localhost:3000')

    socketRef.current.on('connect', () => {
      setConectado(true)
    })

    socketRef.current.on('disconnect', () => {
      setConectado(false)
    })

    socketRef.current.on('messages', (mensajesGuardados) => {
      setMensajes(mensajesGuardados)
    })

    socketRef.current.on('message', (mensaje) => {
      setMensajes(prev => [...prev, mensaje])
    })

    return () => socketRef.current.disconnect()
  }, [])

  const handleNombre = (e) => {
    e.preventDefault()
    const n = nameRef.current.value.trim()
    if (n) setNombre(n)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = inputRef.current.value.trim()
    if (msg && conectado) {
      socketRef.current.emit('message', { nombre, msg })
      inputRef.current.value = ''
    }
  }

  if (!nombre) return (
    <div>
      <form onSubmit={handleNombre}>
        <input ref={nameRef} type="text" placeholder="Ingresa tu nombre" />
        <button>Entrar</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>Hola, {nombre}</h2>
      <p>{conectado ? 'Conectado' : 'Desconectado del servidor'}</p>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="Escribe el mensaje" />
        <button>Enviar</button>
      </form>
      <div>
        {mensajes.map((m, i) => (
          <div key={i}>
            <strong>{m.nombre}</strong>{m.hora && <small> {m.hora}</small>}: {m.msg}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
