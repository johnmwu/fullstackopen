const Message = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const className = isError ? 'error' : 'message'
  return <div className={className}>{message}</div>
}

export default Message