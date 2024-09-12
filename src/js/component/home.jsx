import React, { useEffect, useState } from "react";

// Función para crear un usuario
async function crearUsuario() {
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
}

// Función para eliminar un usuario
async function eliminarUsuario() {
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
}

// Función para leer un usuario
async function leerUsuario() {
    try {
        const resultado = await fetch('https://playground.4geeks.com/todo/users/juanru');
        const data = await resultado.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error ==> ', error);
        return null;
    }
}

// Componente principal
const Home = () => {
    const [newEntry, setNewEntry] = useState('');
    const [toDoList, setToDoList] = useState([]);
    const [estado, setEstado] = useState(false);
    const conteo = toDoList.length;

    function ratonEncimaDelElemento(index) {
        setEstado(index);
    }

    function ratonFueraDelElemento() {
        setEstado(false);
    }

    async function onSubmit(e) {
        e.preventDefault();
        await crearToDo(newEntry);
        setNewEntry('');
        console.log("onSubmit");
    };

    async function eliminarElemento(index) {
        const item = toDoList[index];
        await eliminarToDo(item.id);  // Pasa el ID del item a eliminar
        const result = toDoList.filter((_, i) => i !== index);
        setToDoList(result);
        console.log("onDelete");
    };

    async function crearToDo(item) {
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
            setToDoList(nuevaLista);
            console.log(data);
        } catch (error) {
            console.log('Error al crear ToDo ==> ', error);
        }
    }

    async function eliminarToDo(id) {
        try {
            const res = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error('Error al eliminar el ToDo');
            }
            await leerUsuario();
        } catch (error) {
            console.log('Error ==> ', error);
        }
    }

    async function clearToDoList() {
        for (const item of toDoList) {
            await eliminarToDo(item.id);
        }
        setToDoList([]);
        eliminarUsuario();
    }

    async function fetchData() {
        const data = await leerUsuario();
        console.log(data);
        if (data && Array.isArray(data.todos)) {
            setToDoList(data.todos);
        } else {
            await crearUsuario();
            const nuevaLista = await leerUsuario();
            setToDoList(nuevaLista.todos);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container w-50 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label" style={{ fontSize: "30px", paddingTop: "10px" }}>To Do List</label>
            <div className="container-flex lavenderBlush border myStyle">
                <form onSubmit={onSubmit}>
                    <div className="container-flex border-bottom p-1">
                        <input
                            onChange={(e) => setNewEntry(e.target.value)}
                            value={newEntry}
                            type="text"
                            className="form-control lavenderBlush inputStyle"
                            placeholder="Agregar tarea"
                            id="exampleInput"
                        />
                    </div>
                </form>
                <ul className="list-group list-group-flush">
                    {toDoList.length === 0 ? (
                        <p className="text-center pt-3">No hay tareas</p>
                    ) : (
                        toDoList.map((item, index) => (
                            <li
                                key={index}
                                className="list-group-item lavenderBlush d-flex justify-content-between align-items-center"
                                onMouseOver={() => ratonEncimaDelElemento(index)}
                                onMouseOut={() => ratonFueraDelElemento()}
                            >
                                {item.label}
                                {estado === index && (
                                    <button className="btn" onClick={() => eliminarElemento(index)}>❌</button>
                                )}
                            </li>
                        ))
                    )}
                </ul>
                <div className="pt-3 ps-2 border-top d-flex justify-content-around">
                    Tareas pendientes: {conteo}
                    <button className="btn" onClick={clearToDoList}>Limpiar</button>
                </div>
            </div>
            <div style={{ height: "3px", borderRadius: "3px" }} className="lavenderBlush border mx-1"></div>
            <div style={{ height: "3px", borderRadius: "3px" }} className="lavenderBlush border mx-2"></div>
        </div>
    );
};

export default Home;
