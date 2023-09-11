const readAndDecodeStream = async (reader?: ReadableStreamDefaultReader) => {
    const decoder = new TextDecoder('utf-8');

    if (!reader)
        return ''

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      result += decoder.decode(value);
    }
    
    return JSON.parse(result);
  };

export {
    readAndDecodeStream
}