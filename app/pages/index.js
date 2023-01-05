import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTodo } from '../hooks/todo'
import Loading from '../components/Loading'
import TodoSection from '../components/todo/TodoSection'
import styles from '../styles/Home.module.css'
import { useState } from 'react'


const Home = () => {
    const { initialized, initializeStaticUser, loading, transactionPending, completedTodos, incompleteTodos, addTodo, markTodo, removeTodo, markStaticTodo,removeStaticTodo, addStaticTodo, input,tag  , assigne  , tagHandleChange , assigneChangeHandler,  handleChange , initializeUser , selectTagFromTag } = useTodo()

    const [finalTag,setFinalTag] = useState("")
    const [finalAssigne,setFinalAssigne] = useState("")
    const [borderColor, setBorderColor] = useState("#ffb703")
    return (
        <div >
            <div className={styles.actionsContainer}>
                {initialized ? (
                    <div className={styles.todoInput}>
                    <h1 style={{textAlign:"left",marginLeft:"10px" , fontSize:"20px",color:"#ffb703"}}>PROJECT MANAGER DAPP POWERED BY SOLANA</h1>
                        <div className={`${styles.todoCheckbox} ${styles.checked}`} />
                        <div className={styles.inputContainer}>
                                 
                                <input value = {input} style={{marginTop:"60rem",border:"3px solid #ccc",padding:"5px"}} onChange={handleChange} id={styles.inputField} type="text" placeholder=' Enter The Title ......' autocomplete="off" />
                               
                                <input value = {tag} onChange={tagHandleChange}  style={{marginTop:"1rem",border:`2px solid ${borderColor}`,padding:"5px"}} id={styles.inputField} type="text" placeholder=' Enter The Tag (For ex : Urgent , Major)' />
                            

                                <div>
                                <button style={{backgroundColor:"lightgreen",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("MAJOR")
                               setBorderColor("lightgreen")
                            }}>MAJOR</button>  

                            <button style={{backgroundColor:"#EBB9DF",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("URGENT")
                               setBorderColor("#EBB9DF")
                            }}>URGENT</button> 

<button style={{backgroundColor:"#FD3E81",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("BUG")
                               setBorderColor("#FD3E81")
                            }}>BUG</button>

<button style={{backgroundColor:"#EB9486",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("NEW")
                               setBorderColor("#EB9486")
                            }}>NEW</button>

                            
<button style={{backgroundColor:"#F3DE8A",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("MINOR")
                               setBorderColor("#F3DE8A")
                            }}>MINOR</button>

                            
<button style={{backgroundColor:"#C792DF",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("TEAM")
                               setBorderColor("#C792DF")
                            }}>TEAM</button>

                               
<button style={{backgroundColor:"#A2D2FF",height:"35px",width:"80px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("HELP")
                               setBorderColor("#A2D2FF")
                            }}>HELP</button>

<button style={{backgroundColor:"#f77f00",height:"35px",width:"100px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                               selectTagFromTag("NEED TALK")
                               setBorderColor("#f77f00")
                            }}>NEED TALK</button>
                                </div>

                                

                                
                                
                                <input value = {assigne} onChange={assigneChangeHandler}  style={{marginTop:"1rem",border:"3px solid #ccc",padding:"5px"}} id={styles.inputField} type="text" placeholder=' Assigned To ....' autocomplete="off" />
                                 
                            
                            <button style={{backgroundColor:"skyblue",height:"50px",width:"150px",marginLeft:"15px",borderRadius:"10px",marginTop:"20px"}} onClick={()=>{
                                addTodo()
                                setFinalTag(tag)
                                setFinalAssigne(assigne)
                                console.log(finalTag)
                            }}>Submit</button>    
      
                           
                        </div>
                        <div className={styles.iconContainer}>
       
                        </div>
                    </div>
                ) : (
                    <button type="button" className={styles.button} onClick={() => initializeUser()} disabled={transactionPending}>
                        Initialize
                    </button>
                )}
                <WalletMultiButton />
            </div>

            <div >
                <Loading loading={loading}>
                    {/* <TodoSection title="Tasks" todos={incompleteTodos} action={markStaticTodo} /> */}
                    <TodoSection title="Tasks" todos={incompleteTodos} tag={finalTag} assigne = {finalAssigne} action={markTodo} />
                    {/* <TodoSection title="Completed" todos={completedTodos} action={removeStaticTodo} /> */}
                    <TodoSection title="Completed" todos={completedTodos} assigne = {finalAssigne} tag={finalTag} action={removeTodo} />
                </Loading>
            </div>
        </div>
    )
}

export default Home
