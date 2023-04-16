class ResponsePreset {
  
  resOK(message, data) {
    return {
      status: 200,
      message,
      ...(data === null ? {} : {data})
    }
  }
  
  resErr(status, message, type, data) {
    return {
      status,
      message,
      err: {
        type,
        ...(data === null ? {} : {data})
      }
    }
  }
}

export default ResponsePreset;