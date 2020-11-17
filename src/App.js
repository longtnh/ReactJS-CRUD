// json-server --watch db.json --port 3001

import React, {useState, useEffect} from 'react';
import './App.css';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import axios from 'axios';

function App() {
	
	const [data, setData] = useState([]);
	const [modelEdit, setModelEdit] = useState(false);
	const [modelDelete, setModelDelete] = useState(false);
	const [modelInsert, setModelInsert] = useState(false);

	const [countrySelect, setCountrySelect] = useState({
		id: '',
		name: '',
		capital: ''
	});

	useEffect(() => {
		loadData();
	  }, []);

	const loadData = async () => {
		const result = await axios.get("http://localhost:3001/country");
		setData(result.data);
	  };
	
	const selectCountry = (elements, caseSt)=>{
		setCountrySelect(elements);
		(caseSt === 'Edit') ? setModelEdit(true) : setModelDelete(true)
	}

	
	const handleChange = e =>{
		const {name, value}=e.target;
		setCountrySelect((prevState)=>({...prevState,[name]: value}));
	  }
	
	// const edit = () =>{
	// 	var dataNueva=data;
	// 	dataNueva.map(country=>{
	// 		if(country.id===countrySelect.id){
	// 		country.capital=countrySelect.capital;
	// 		country.name=countrySelect.name;
	// 		}
	// 	});
	// 	setData(dataNueva);
	// 	setModelEdit(false);
	// }

	const update = () => {
		data.map(country => {
			if(country.id===countrySelect.id){
				country.capital=countrySelect.capital;
				country.name=countrySelect.name;
			}
		});
		axios.put(`http://localhost:3001/country/${countrySelect.id}`, countrySelect);
		setData(data);
		setModelEdit(false);
	}

	const remove = () => {
		const resp = axios.delete(`http://localhost:3001/country/${countrySelect.id}`)
		setModelDelete(false);
		setData(data.filter(country => country.id !== countrySelect.id));
	}
	
	const onInsert = () => {
		setCountrySelect(null);
		setModelInsert(true);
	}

	const add = async () => {
		var country = countrySelect;
		country.id=data[data.length-1].id+1;
		let json = await axios.post("http://localhost:3001/country", country);
		setModelInsert(false);
		setData(data => [...data, country]);
	}
	return (
		<div className="App">
		<br />
		<h1>Country Capital CRUD</h1>
		<button className="btn btn-success" onClick={()=>onInsert()}>Insert</button>
		<br /><br />
			<table className="table table-bordered">
			<thead>
				<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Capital</th>
				<th></th>
				</tr>
			</thead>
			<tbody>
				{data.map(element=>(
				<tr>
					<td>{element.id}</td>
					<td>{element.name}</td>
					<td>{element.capital}</td>
					<td><button className="btn btn-primary" onClick={()=>selectCountry(element, 'Edit')}>Edit</button> {"   "} 
					<button className="btn btn-danger" onClick={()=>selectCountry(element, 'Remove')}>Remove</button></td>
				</tr>
				))
				}
			</tbody>
			</table>
  
		<Modal isOpen={modelEdit}>
			<ModalHeader>
				<div>
				<h3>Edit</h3>
				</div>
			</ModalHeader>
			<ModalBody>
				<div className="form-group">
				<label>ID</label>
				<input
					className="form-control"
					readOnly
					type="text"
					name="id"
					value={countrySelect && countrySelect.id}
					onChange={handleChange}
				/>
				<br />
	
				<label>Country</label>
				<input
					className="form-control"
					type="text"
					name="name"
					value={countrySelect && countrySelect.name}
					onChange={handleChange}
				/>
				<br />
	
				<label>Capital</label>
				<input
					className="form-control"
					type="text"
					name="capital"
					value={countrySelect && countrySelect.capital}
					onChange={handleChange}
				/>
				<br />
				</div>
			</ModalBody>
			<ModalFooter>
				<button className="btn btn-primary" onClick={()=>update()}>
				Update
				</button>
				<button
				className="btn btn-danger"
				onClick={() => setModelEdit(false)}
				>
				Cancel
				</button>
			</ModalFooter>
		</Modal>
  
  
		<Modal isOpen={modelDelete}>
			<ModalBody>
				Delete {countrySelect && countrySelect.name}
			</ModalBody>
			<ModalFooter>
				<button className="btn btn-danger" onClick={()=>remove()}>
				Yes
				</button>
				<button
				className="btn btn-secondary"
				onClick={()=>setModelDelete(false)}
				>
				No
				</button>
			</ModalFooter>
		</Modal>
  
  
		<Modal isOpen={modelInsert}>
			<ModalHeader>
			<div>
				<h3>Insert</h3>
			</div>
			</ModalHeader>
			<ModalBody>
			<div className="form-group">
				<label>ID</label>
				<input
				className="form-control"
				readOnly
				type="text"
				name="id"
				value={data.id+1}
				/>
				<br />

				<label>Name</label>
				<input
				className="form-control"
				type="text"
				name="name"
				value={countrySelect ? countrySelect.name : ''}
				onChange={handleChange}
				/>
				<br />

				<label>Capital</label>
				<input
				className="form-control"
				type="text"
				name="capital"
				value={countrySelect ? countrySelect.capital : ''}
				onChange={handleChange}
				/>
				<br />
			</div>
			</ModalBody>
			<ModalFooter>
			<button className="btn btn-primary"
			onClick={()=>add()}>
				Insert
			</button>
			<button
				className="btn btn-danger"
				onClick={ () => setModelInsert(false)}
			>
				Cancel
			</button>
			</ModalFooter>
		</Modal>
	  </div>
	);
}



export default App;
