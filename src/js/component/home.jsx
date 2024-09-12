import React, { useEffect, useState } from "react";

// Crea juanru
const crearUsuario = async () => {
    try {
        const res = await fetch('https://playground.4geeks.com/todo/users/juanru', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'juanru' })
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error al crear usuario ==> ', error);
    }
};

// Elimina juanru
const eliminarUsuario = async () => {
    try {
        const res = await fetch("https://playground.4geeks.com/todo/users/juanru", {
            method: 'DELETE'
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error al eliminar usuario ==> ', error);
    }
};

// Lee los datos de juanru
const leerUsuario = async () => {
    try {
        const resultado = await fetch('https://playground.4geeks.com/todo/users/juanru');
        const data = await resultado.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error ==> ', error);
        return null;
    }
};

// Componente principal que gestiona la lista de tareas
const Home = () => {
    const [newEntry, setNewEntry] = useState(''); // Entrada de nueva tarea
    const [toDoList, setToDoList] = useState([]); // Lista de tareas
    const [estado, setEstado] = useState(false); // Control del botón eliminar
    const conteo = toDoList.length; // Número de tareas pendientes

    const ratonEncimaDelElemento = (index) => {
        setEstado(index); // Mostrar botón eliminar cuando el ratón está encima
    };

    const ratonFueraDelElemento = () => {
        setEstado(false); // Ocultar botón eliminar cuando el ratón sale
    };

    // Envío del formulario para agregar una tarea
    const onSubmit = async (e) => {
        e.preventDefault();
        if (newEntry.trim() === "") return; // No agregar si está vacío
        await crearToDo(newEntry);
        setNewEntry(''); // Limpia el campo de entrada
        console.log("onSubmit");
    };

    // Elimina una tarea de la lista
    const eliminarElemento = async (index) => {
        const item = toDoList[index];
        await eliminarToDo(item.id);  // Pasa el ID del item a eliminar
        const result = toDoList.filter((_, i) => i !== index);
        setToDoList(result); // Actualiza la lista sin el elemento eliminado
        console.log("onDelete");
    };

    // Crea una nueva tarea
    const crearToDo = async (item) => {
        try {
            const res = await fetch('https://playground.4geeks.com/todo/todos/juanru', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "label": item,
                    "is_done": false
                })
            });
            const data = await res.json();
            const nuevaLista = [...toDoList, { id: data.id, label: item }];
            setToDoList(nuevaLista); // Añade la nueva tarea a la lista
            console.log(data);
        } catch (error) {
            console.log('Error al crear ToDo ==> ', error);
        }
    };

    // Elimina una tarea mediante su ID
    const eliminarToDo = async (id) => {
        try {
            const res = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error('Error al eliminar el ToDo');
            }
            await leerUsuario(); // Actualiza los datos del usuario tras eliminar el ToDo
        } catch (error) {
            console.log('Error ==> ', error);
        }
    };

    // Elimina todas las tareas y al usuario
    const clearToDoList = async () => {
        for (const item of toDoList) {
            await eliminarToDo(item.id); // Elimina cada tarea individualmente
        }
        setToDoList([]); // Limpia la lista local
        eliminarUsuario(); // Elimina el usuario 
    };

    // Recupera los datos del usuario
    const fetchData = async () => {
        const data = await leerUsuario();
        console.log(data);
        if (data && Array.isArray(data.todos)) {
            setToDoList(data.todos); // Si el usuario existe, carga sus tareas
        } else {
            await crearUsuario(); // Si no existe, crea el usuario
            const nuevaLista = await leerUsuario();
            setToDoList(nuevaLista.todos); // Carga las tareas del nuevo usuario
        }
    };

    // Carga los datos 
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container w-75 text-center mt-5">
            <h1 className="display-4" style={{ fontSize: "35px", paddingBottom: "20px", color: "#5a5a5a" }}>Mi To-Do List</h1>
            <div className="container-flex bg-light border rounded shadow-lg p-3">
                <form onSubmit={onSubmit}>
                    <div className="d-flex justify-content-between border-bottom p-3">
                        <input
                            onChange={(e) => setNewEntry(e.target.value)}
                            value={newEntry}
                            type="text"
                            className="form-control mb-3 me-2"
                            placeholder="Añadir una nueva tarea"
                            id="newTodoInput"
                            style={{ fontSize: "18px", height: "45px" }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary mb-3"
                        >
                            Agregar tarea
                        </button>
                    </div>
                </form>
                <ul className="list-group list-group-flush">
                    {toDoList.length === 0 ? (
                        <p className="text-center pt-4" style={{ fontSize: "18px", color: "#6c757d" }}>No hay tareas disponibles</p>
                    ) : (
                        toDoList.map((item, index) => (
                            <li
                                key={index}
                                className="list-group-item bg-white d-flex justify-content-between align-items-center mb-2"
                                onMouseOver={() => ratonEncimaDelElemento(index)}
                                onMouseOut={() => ratonFueraDelElemento()}
                                style={{ fontSize: "20px", padding: "15px 10px", cursor: "pointer" }}
                            >
                                {item.label}
                                {estado === index && (
                                    <button onClick={() => eliminarElemento(index)}>Eliminar</button>
                                )}
                            </li>
                        ))
                    )}
                </ul>
                <div className="pt-4 d-flex justify-content-between align-items-center">
                    <span className="text-muted">Tareas pendientes: {conteo}</span>
                    <button className="btn btn-danger" onClick={clearToDoList}>Limpiar lista</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
