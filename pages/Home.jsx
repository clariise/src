import Employee from './Employee';
import {useState,useEffect } from 'react';
import {getFirestore, collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc} from "firebase/firestore";
import firebaseApp from "./firebaseConfig";
import {getAuth, onAuthStateChanged} from "firebase/auth";


function Home (){

    const [employee, setEmployee] = useState ({
        firstname: '',
        lastname: '',
        number: '',
      });

      //Array of an object, once we hit add ag append sa studentlist
    const [employeeList, setEmployeeList] = useState([]); 
    const [authenticated, setAuthenticated] = useState (false);
    const [editToggle, setEditToggle] = useState(false);
    const [userProperties, setUserProperties] = useState({});

    useEffect(() => {


        //initialize Cloud firestore and get a reference to the service
        const db= getFirestore(firebaseApp);

            try  { 
                
                onSnapshot (collection(db, 'employees'), snapshot => {
         
                const newEmployeeList = [];

                snapshot.forEach(employee => {
                    const tempEmployee = employee.data();
                    tempEmployee["employee_id"] = employee.id;
                    newEmployeeList.push(tempEmployee);
                });

                setEmployeeList(newEmployeeList);

            });

            } catch(e){
                alert('Could not fetch employee data.')
            }

            const auth = getAuth(firebaseApp);
            onAuthStateChanged(auth, (user) => {
    
                console.log(user);
                if (user) {
                    setAuthenticated (true);
                    console.log(user.providerData);
                    setUserProperties(user);
                    //user is signed in, look for docs for a list of available properties
    
                    const uid = user.uid;
                   
    
                }
            });

}, [])

    const addEmployee = () => {

            //initialize Cloud firestore and get a reference to the service
            const db= getFirestore(firebaseApp);


        if (employee.firstname == '' || employee.lastname == '' || employee.number == '' ){
            alert("Missing Fields");
        } else {
        setEmployeeList (
            employeeList => [
                ...employeeList, employee
            ]
        );

      addDoc(collection(db, 'employees'), employee);

        setEmployee({
            firstname:'',
            lastname:'',
            number:'',
          });

        }

    }

    const deleteEmployee = (employeeID, firstname, lastname) => {

           //initialize Cloud firestore and get a reference to the service
           const db= getFirestore(firebaseApp);

       confirm (`Are you sure you want to delete ${firstname} ${lastname}?`).then(
        deleteDoc(doc(db, "employees", employeeID))
       );

    } 


    const updateEmployee = ( employeeID, firstname, lastname, number) => {
        setEditToggle(true);

        setEmployee({
            employeeID :  employeeID,
            firstname: firstname,
            lastname: lastname,
            number: number
        });
    }

    const handleStudentUpdate =() => {

         //initialize Cloud firestore and get a reference to the service
         const db= getFirestore(firebaseApp);

         const employeeRef = doc(db, "employees", employee.employeeID );

         updateDoc(employeeRef, {
            firstname: employee.firstname,
            lastname: employee.lastname,
            number: employee.number

         });

        setEditToggle(false);
        setEmployee({
            firstname:'',
            lastname:'',
            number:'',
        });
    }

    if (authenticated) {

        return (
        
        
            <section>
            <h1 className="mt-5" >👩‍🏭Hello, {userProperties.displayName}</h1>
            <p>A tool for HR Departments and organizations to manage employee data.</p>
        
            <div className="mb-5 p-5 border">
                    <div className="row">
    
                        <div className="col-md-5">
                    <label htmlFor="firstname">Firstname:</label>
                    <input id="firstname" 
                      onChange={(e)=> setEmployee({
                      ...employee, //Short form 
                      firstname: e.target.value
                  })} 
                  value={employee.firstname}
                  className="form-control"  
                  type="text"  
                    />
                    </div>
    
                    <div className="col-md-5">
                    <label htmlFor="lastname">Lastname:</label>
                    <input id="lastname" 
                      onChange={(e)=> setEmployee({
                      ...employee,
                      lastname: e.target.value
                  })} 
                  value={employee.lastname}
                  className="form-control" 
                    type="text" 
                    />
                    </div>
    
    
                    <div className="col-md-2">
                    <label htmlFor="number">ID number:</label>
                    <input id="number" 
                      onChange={(e)=> setEmployee({
                      ...employee,
                      number: e.target.value
                  })} 
                  value={employee.number}
                    className="form-control" 
                    type="number" 
                    />
                    </div>
    
                    {
                       editToggle 
                       ?
    
                       (
                        <div className="col-md-2">
                            <button onClick={() => {handleStudentUpdate()}} className="btn btn-success mt-3">Update</button>
                        </div>
                       )
    
                       :
    
                       (
                        <div className="col-md-2">
                            <button onClick={() => {addEmployee()}} className="btn btn-dark mt-3">Add Employee +</button>
                        </div>
                       )
                    }
    
                        <div className="alert alert-light mt-3">
                            <h3 className="fw-bold">{employee.firstname} {employee.lastname} <span className="badge bg-dark"> {employee.number} </span></h3>
                        </div>
                    </div>
                    <br />
                    </div>
    
                    
                    {
                    employeeList.map((employeeRecord) => 
                    <Employee
                    Key={employeeRecord.id} 
                    firstname={employeeRecord.firstname}
                    lastname={employeeRecord.lastname}
                    number={employeeRecord.number}
                    deleteEmployee={deleteEmployee}
                    updateEmployee={updateEmployee}
                    employeeID= {employeeRecord.employee_id}
                    />
                    )} 
            </section>
      
        )
            }else {
                return (
                    <section>
                        <h1>Hello Guest</h1>
                    </section>
                )
        
    }
}

export default Home;