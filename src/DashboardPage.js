import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import './DashboardPage.css';

const DashboardPage = ({ id, setIsAuthenticated }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    check: [],
    finished: [],
  });

 

  const navigate = useNavigate();  // Use navigate instead of history

  // Secret key for encryption (should be stored securely)

  // Check if the user is authenticated on component load
//   useEffect(() => {
//     // const checkAuth = () => {
//     //    const notencryptedIsAuth = localStorage.getItem('isAuthenticated');
//     // //   const encryptedvalue = encryptValue(notencryptedIsAuth);
//     // //   if (!encryptedvalue) {
//     // //     console.log(encryptedvalue);
//     // //     // Redirect to login if not authenticated
//     // //     navigate('/login');  // Use navigate instead of history.push
//     // //     return;
//     // //   }

//     //   // Decrypt and verify the authentication status
//     //   const bytes = CryptoJS.AES.decrypt(notencryptedIsAuth, secretKey);
//     //   const decryptedIsAuth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     //   console.log(decryptedIsAuth);

//     //   if (!decryptedIsAuth) {
//     //     console.log(decryptedIsAuth);
        
//     //     navigate('/login');  // Use navigate instead of history.push
//     //   }
//     // };

//     checkAuth();
//   }, [navigate, secretKey]);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    const secretKey = 'your-secret-key';
    
    const authfrombrowser = localStorage.getItem('isAuthenticated');
    console.log(authfrombrowser);

    const bytes = CryptoJS.AES.decrypt(authfrombrowser, secretKey);
    const decryptedauth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedauth);

    
    
       
    
    setIsAuthenticated(true);
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://taskmanagerkhayal.fly.dev/dashboard?id=${id}`);
        const taskData = response.data.results;
        const uniqueTasks = [...new Set(taskData.map(task => task.task_id))].map(id =>
            taskData.find(task => task.task_id === id)
          );
  
          // Organize tasks based on their task_status
          const organizedTasks = {
            todo: [],
            inProgress: [],
            check: [],
            finished: [],
          };
  
          uniqueTasks.forEach(task => {
            switch (task.task_status) {
              case 1:
                organizedTasks.todo.push(task);
                break;
              case 2:
                organizedTasks.inProgress.push(task);
                break;
              case 3:
                organizedTasks.check.push(task);
                break;
              case 4:
                organizedTasks.finished.push(task);
                break;
              default:
                break;
            }
          });
  
          setTasks(organizedTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
  
      fetchTasks();
    }, [id]);
  
    // Handle drag and drop functionality
    const handleOnDragEnd = (result) => {
      const { destination, source } = result;
  
      if (!destination) return;
  
      // If the task is dropped in the same position, do nothing
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
  
      const sourceColumn = source.droppableId;
      const destinationColumn = destination.droppableId;
  
      const movedTask = tasks[sourceColumn][source.index];
  
      // Prevent dragging from 'check' to 'finished'
      if (sourceColumn === 'check' && destinationColumn === 'finished') {
        return;
      }
  
      // If task is being moved between columns
      if (sourceColumn !== destinationColumn) {
        const updatedSourceTasks = [...tasks[sourceColumn]];
        const updatedDestinationTasks = [...tasks[destinationColumn]];
  
        // Remove from the source and add to the destination
        updatedSourceTasks.splice(source.index, 1);
        updatedDestinationTasks.splice(destination.index, 0, movedTask);
  
        setTasks({
          ...tasks,
          [sourceColumn]: updatedSourceTasks,
          [destinationColumn]: updatedDestinationTasks,
        });
  
        // Optionally, send an API request to update task status on the server
        movedTask.task_status = getColumnStatus(destinationColumn);
        axios.put(`https://taskmanagerkhayal.fly.dev/dashboard?task_id=${movedTask.task_id}&task_status=${movedTask.task_status}`);
      }
    };
  
    // Map column IDs to task statuses
    const getColumnStatus = (columnId) => {
      switch (columnId) {
        case 'todo':
          return 1;
        case 'inProgress':
          return 2;
        case 'check':
          return 3;
        case 'finished':
          return 4;
        default:
          return null;
      }
    };
  
    return (
      <div className="dashboard">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="columns">
            {/* To Do Column */}
            <Droppable droppableId="todo">
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>To Do</h2>
                  {tasks.todo.map((task, index) => (
                    <Draggable key={task.task_id} draggableId={String(task.task_id)} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.task_name}</h5>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
  
            {/* In Progress Column */}
            <Droppable droppableId="inProgress">
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>In Progress</h2>
                  {tasks.inProgress.map((task, index) => (
                    <Draggable key={task.task_id} draggableId={String(task.task_id)} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.task_name}</h5>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
  
            {/* Check Column */}
            <Droppable droppableId="check">
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>Check</h2>
                  {tasks.check.map((task, index) => (
                    <Draggable key={task.task_id} draggableId={String(task.task_id)} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.task_name}</h5>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
  
            {/* Finished Column */}
            <Droppable droppableId="finished">
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>Finished</h2>
                  {tasks.finished.map((task, index) => (
                    <Draggable key={task.task_id} draggableId={String(task.task_id)} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.task_name}</h5>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
      </div>
    );
  };

export default DashboardPage;
