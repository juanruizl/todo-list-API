//Importacion de la biblioteca principal de react
import React, { useState, useEffect } from 'react';



// Componente principal de la aplicación
const Home = () => {
  // Hooks de estado
  const [newEntry, setNewEntry] = useState(''); // Almacena la nueva tarea que el usuario ingresa
  const [toDoList, setToDoList] = useState([]); // Almacena la lista de tareas actual
  const [loading, setLoading] = useState(true); // Estado para controlar si la app está cargando

  // Esta variable controla el nombre del usuario (puedes cambiarla a tu gusto)
  const username = 'Truficop';

  // useEffect se ejecuta al cargar la página, y verifica si el usuario existe
  useEffect(() => {
    const initializeUser = async () => {
      await comprobarUsuarioYCrearSiNoExiste();
      await fetchData();
      setLoading(false); // Una vez que se cargan los datos, quitamos el estado de carga
    };
    initializeUser(); // Ejecutamos la función al montar el componente
  }, []);

  // Función para comprobar si el usuario existe y crearlo si no existe
  const comprobarUsuarioYCrearSiNoExiste = async () => {
    try {
      // Intentamos leer el usuario
      const response = await fetch(`https://playground.4geeks.com/todo/user/juanRu`);
      
      // Si el estado no es OK, asumimos que el usuario no existe
      if (!response.ok) {
        console.log("El usuario no existe, creando usuario...");
        // Intentamos crear el usuario
        const crearUsuarioResponse = await fetch(`https://playground.4geeks.com/todo/user/juanRu`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: juanRu }) // Se envía el nombre del usuario
        });

        if (!crearUsuarioResponse.ok) {
          throw new Error('Error al crear el usuario');
        }

        console.log("Usuario creado correctamente.");
      } else {
        console.log("El usuario ya existe.");
      }
    } catch (error) {
      console.log('Error al verificar o crear el usuario:', error);
    }
  };

  // Función para obtener las tareas del servidor
  const fetchData = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/user/juanRu`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setToDoList(data); // Actualizamos el estado con las tareas del servidor
      }
    } catch (error) {
      console.log('Error al obtener tareas del servidor:', error);
    }
  };

  // Función para agregar una nueva tarea
  const crearToDo = async (item) => {
    const updatedList = [...toDoList, { label: item, done: false }]; // Añadimos la nueva tarea a la lista actualizada
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/user/juanRu`, {
        method: 'PUT', // El método PUT reemplaza toda la lista de tareas
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedList) // Enviamos la lista actualizada
      });

      if (!response.ok) {
        throw new Error('Error al sincronizar las tareas con el servidor');
      }

      setToDoList(updatedList); // Actualizamos la lista de tareas en el frontend
    } catch (error) {
      console.log('Error al agregar la tarea:', error);
    }
  };

  // Función para eliminar una tarea por su índice
  const eliminarToDo = async (index) => {
    const updatedList = toDoList.filter((_, i) => i !== index); // Filtramos la tarea seleccionada
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/user/juanRu`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedList) // Sincronizamos la lista filtrada
      });

      if (!response.ok) {
        throw new Error('Error al sincronizar las tareas con el servidor');
      }

      setToDoList(updatedList); // Actualizamos el estado de la lista
    } catch (error) {
      console.log('Error al eliminar la tarea:', error);
    }
  };

  // Función para limpiar todas las tareas
  const clearTasks = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/user/juanRu`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([]) // Enviamos una lista vacía para eliminar todas las tareas
      });

      if (!response.ok) {
        throw new Error('Error al limpiar las tareas');
      }

      setToDoList([]); // Limpiamos la lista localmente
      console.log('Todas las tareas han sido eliminadas.');
    } catch (error) {
      console.log('Error al limpiar la lista:', error);
    }
  };

  // Función para manejar el envío del formulario y agregar una tarea nueva
  const onSubmit = async (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return; // Si la entrada está vacía, no hacer nada
    await crearToDo(newEntry); // Agregamos la nueva tarea
    setNewEntry(''); // Limpiamos el input después de agregar la tarea
  };

  // Renderizamos la UI
  return (
    <div className="container">
      <h1>To-Do List</h1>

      {loading ? (
        <p>Cargando...</p> // Mostramos un mensaje de carga mientras las tareas se obtienen
      ) : (
        <>
          {/* Formulario para agregar una nueva tarea */}
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)} // Actualizamos el valor del input
              placeholder="Agregar tarea"
            />
            <button type="submit">Agregar</button>
          </form>

          {/* Lista de tareas */}
          <ul>
            {toDoList.length === 0 ? (
              <li>No hay tareas</li> // Mostramos un mensaje si no hay tareas
            ) : (
              toDoList.map((task, index) => (
                <li key={index}>
                  {task.label}
                  <button onClick={() => eliminarToDo(index)}>Eliminar</button> {/* Botón para eliminar cada tarea */}
                </li>
              ))
            )}
          </ul>

          {/* Botón para limpiar todas las tareas */}
          {toDoList.length > 0 && (
            <button onClick={clearTasks}>Limpiar todas las tareas</button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

