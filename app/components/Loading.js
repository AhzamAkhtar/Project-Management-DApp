const Loading = ({ loading, children }) => {
    if (loading) return (
        <div >

        <p>Loading...</p>
        </div>
    )
    

    return <>{children}</>
}

export default Loading