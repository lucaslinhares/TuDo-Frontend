import React, { useState, useEffect } from 'react';
import logo from './logo TuDo.png';
import './App.css';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { SplitButton } from 'primereact/splitbutton';
import api from './api/api.js'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import './DataViewDemo.css';
import PrimeReact from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';

function App() {
    PrimeReact.ripple = true;
    const [checked, setChecked] = useState(false);
    const [layout, setLayout] = useState("grid");
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [displayMaximizable, setDisplayMaximizable] = useState(false);
    const [displayPosition, setDisplayPosition] = useState(false);
    const [position, setPosition] = useState('center');
    const [db, setDb] = useState([]);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        getDataFromApi()
    }, []);

    async function getDataFromApi() {
        await api.get('/notes')
            .then((response) => {
                setDb(response.data)
            })
            .catch(
                err => console.log(err)
            );
    }

    async function createNote(event) {
        event.preventDefault();
        let note = {
            title: title,
            text: text
        }

        await api.post('/notes/', note)
            .then(response => {
                console.log(response)
                
                alert(`Nota adicionada com sucesso!
                      ID: ${db[db.length - 1].id + 1}
                      Título: ${note.title}
                      Texto: ${note.text}`)

                setDisplayBasic(false)
                setTitle("")
                setText("")
                window.location.reload();


            })
            .catch(error => {
                console.log(error)
            })
    }

    async function deleteNote(event, id) {
        event.preventDefault();
        console.log(id)
        await api.delete(`/notes/${id}`)
            .then(response => {
                console.log(response)
                alert(`Nota removida com sucesso!`)
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
            })
    }

/*
    function setCheckedNote(event, data) {
        let index = db.findIndex(function (item, index) {
            if (item.id == data.id)
                return true;
        })

        let database = db

        database[index].checked = !database[index].checked

        
        setDb(database)
        alert(db[index].checked)
    }*/

    /** */
    async function setCheckedNote(event, id) {
        event.preventDefault();
        console.log(id)
        await api.put(`/notes/${id}`)
            .then(response => {
                console.log(response)
                
                let index = db.findIndex(function (item, index) {
                if (item.id == id)
                    return true;
                })
                if(!db[index].checked){
                  alert('Atividade marcada como concluida!!')
                } else {
                  alert('Atividade desmarcada!!')
                }
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
            })
    }
    /** */

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayBasic2': setDisplayBasic2,
        'displayModal': setDisplayModal,
        'displayMaximizable': setDisplayMaximizable,
        'displayPosition': setDisplayPosition
    }

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        setTitle("")
        setText("")
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Adicionar" icon="pi pi-check" onClick={(event) => createNote(event)} />
            </div>
        );
    }

    const renderGridItem = (data) => {
      /**/
        
      /** */
        return (
            <div className="p-col-12 p-md-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-pencil product-category-icon"></i>
                            <span className="product-category">{data.title}</span>
                        </div>
                    </div>
                    <div className="product-grid-item-content">
                        <div className="product-name" style={{ marginTop: '24px', marginBottom: '24px' }}>{data.text}</div>
                    </div>
                    <div className="product-grid-item-bottom">
                        <Checkbox inputId="binary" checked={data.checked} onChange={e => setCheckedNote(e, data.id)} />
                        <Button icon="pi pi-trash" onClick={(event) => deleteNote(event, data.id)} className="p-button-rounded" style={{ backgroundColor: 'rgb(88, 123, 190)' }} />
                    </div>
                </div>
            </div>
        );
    }

    const itemTemplate = (task, layout) => {
        if (!task) {
            return;
        }

        return renderGridItem(task);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo TuDo" />
            </header>
            <main>
                <div className="dataview-demo" >
                    <div style={{ maxWidth: '1920px' }}>

                        <DataView value={db} layout={layout} itemTemplate={itemTemplate}
                        />
                    </div>
                </div>

                <Button className="add-button" onClick={() => onClick('displayBasic')} style={{ backgroundColor: 'rgb(0, 0, 0)', boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)', position: 'sticky', bottom: 60, height: 70, width: 70, zIndex: 3 }} icon="pi pi-plus" className="p-button-rounded" />
                <Dialog header="Adicionar nota" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>Título</strong>
                        <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
                        <strong>Texto</strong>
                        <InputTextarea rows={5} cols={30} value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                </Dialog>
            </main>
        </div>


    );
}

export default App;
