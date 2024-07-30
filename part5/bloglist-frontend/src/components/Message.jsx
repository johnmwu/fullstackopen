const Message = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={isError ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Message