 import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import { TODO_PROGRAM_PUBKEY } from '../constants'
import todoIDL from '../constants/todo.json'
import toast from 'react-hot-toast'
import { SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { authorFilter } from '../utils'
import { set } from '@project-serum/anchor/dist/cjs/utils/features'

// Static data that reflects the todo struct of the solana program
let dummyTodos = [
    {
        account:{
            idx: '0',
            content: 'Finish the essay collaboration',
            marked: false,
        }

    },
    {
        account:{
            idx: '1',
            content: 'Understand Static Todo App',
            marked: false,          
        }

    },
    {
        account:{
            idx: '2',
            content: 'Read next chapter of the book in Danish',
            marked: false,   
        }
    },
    {
        account:{
            idx: '3',
            content: 'Do the math for next monday',
            marked: false,   
        }
    },
    {
        account:{
            idx: '4',
            content: 'Send the finished assignment',
            marked: true,  
        }
    },
    {
        account:{
            idx: '5',
            content: 'Read english book chapter 5',
            marked: true,          
        }
    },
]


export function useTodo() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [lastTodo, setLastTodo] = useState(0)
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)
    const [input, setInput] = useState("")
    const [tag,setTag] = useState("")
    const [assigne , setAssigne] = useState("")


    const [tagFromTag , SetTagFromTag] = useState("")

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(todoIDL, TODO_PROGRAM_PUBKEY, provider)
        }
    }, [connection, anchorWallet])
      
    useEffect(() => {
        const findProfileAccounts = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    setLoading(true)
                    const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)

                    if (profileAccount) {
                        setLastTodo(profileAccount.lastTodo)
                        setInitialized(true)

                        const todoAccounts = await program.account.todoAccount.all([authorFilter(publicKey.toString())])
                        setTodos(todoAccounts)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setTodos([])
                } finally {
                    setLoading(false)
                }
            }
        }

        findProfileAccounts()
    }, [publicKey, program, transactionPending])

    const handleChange = (e)=> {
        setInput(e.target.value)
    }
    const tagHandleChange = (e) => {
        setTag(e.target.value)
    }

    const assigneChangeHandler = (e) => {
        setAssigne(e.target.value)
    }


    const selectTagFromTag = (tag) => {
        setTag(tag)
    }
  
    const initializeUser = async () => {
        // Check if the program exist and wallet is connected
        if(program && publicKey){
            try{
                setTransactionPending(true)
                const [profilePda,profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'),publicKey.toBuffer()],program.programId)
                const tx = await program.methods.initializeUser()
                .accounts({
                    userProfile : profilePda,
                    authority : publicKey,
                    SystemProgram : SystemProgram.programId,
                })
                .rpc()
                setInitialized(true)
                toast.success("Successfully Initialized")
            } catch(error){
                console.log(error)
                toast.error(error.toString())
            } finally {
                setTransactionPending(false)
            }
        } 
    }

    const initializeStaticUser = () => {
        setInitialized(true)   
    }

    const addTodo = async (e) =>{
        //e.preventDefault()
        if(program && publicKey) {
            try{
                setTransactionPending(true)
                const [profilePda , profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const [todoPda,todoBump] = findProgramAddressSync([utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([lastTodo])], program.programId)
                if(input && tag && assigne){
                    await program.methods
                    .addTodo(input,tag,assigne)
                    .accounts({
                        userProfile : profilePda,
                        todoAccount : todoPda,
                        authority : publicKey,
                        SystemProgram : SystemProgram.programId,
                    })
                    .rpc()
                    toast.success("Successfully Added Todod")

                }
            }catch(error){
                console.log(error)
                toast.error(error.toString())
            } finally {
                setTransactionPending(false)
                setInput("")
                setTag("")
                setAssigne("")
            }
        }
    }

    const markTodo = async (todoPda , todoIdx) => {
        if(program && publicKey){
            try{
                setTransactionPending(true)
                setLoading(true)
                const [profilePda , profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                await program.methods
                .markTodo(todoIdx)
                .accounts({
                    userProfile : profilePda,
                    todoAccount : todoPda,
                    authority : publicKey,
                    SystemProgram : SystemProgram.programId,
                })
                .rpc()
                toast.success("Successfully marked todo")
            } catch (error) {
                console.log(error)
                toast.success(error.toString())
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const addStaticTodo = (e) => {
        e.preventDefault()
        if(input) {
            const newTodo = {
                account:{
                    idx: parseInt(todos[todos.length-1].account.idx) + 1,
                    content: input,
                    marked: false
                }
            }
            setTodos([newTodo,...todos])
            setInput("")
        }
    }

    const markStaticTodo = (todoID) => {
        setTodos(
          todos.map(todo => {
            console.log(todo.account, todoID, "YTAAAAA")
            if (todo.account.idx === todoID) {
                console.log("MATCHED")
                return {
                  account: {
                    idx: todo.account.idx,
                    content: todo.account.content,
                    marked: !todo.account.marked
                  }
                }
            }
    
            return todo
          }),
        )
    }

    const removeTodo = async (todoPda, todoIdx) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                await program.methods
                    .removeTodo(todoIdx)
                    .accounts({
                        userProfile: profilePda,
                        todoAccount: todoPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                toast.success('Successfully removed todo.')
            } catch (error) {
                console.log(error)
                toast.error(error.toString())
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const removeStaticTodo = async (todoID) => {
        setTodos(
            todos.filter(todo => {
              if (todo.account.idx === todoID) {
                return 
              }
      
              return todo
            }),
          )
    }


    const incompleteTodos = useMemo(() => todos.filter((todo) => !todo.account.marked), [todos])
    const completedTodos = useMemo(() => todos.filter((todo) => todo.account.marked), [todos])

    return { initialized, initializeStaticUser, loading, transactionPending, completedTodos, incompleteTodos, markStaticTodo, removeStaticTodo, addStaticTodo, input, tag ,assigne ,  setInput, handleChange  , tagHandleChange , assigneChangeHandler ,  initializeUser, addTodo , markTodo,removeTodo , selectTagFromTag}
}
