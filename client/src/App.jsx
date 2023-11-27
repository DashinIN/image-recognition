import  { useState, useEffect } from 'react';
import './index.scss'
import { useImageLoadMutation } from './store/imageLoad'
import ImageInput from './features/ImageInput/ImageInput';
import Result from './features/Result/Result';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.title = 'Digit Recognition'; 
  }, []);

  const [loadImage, { isLoading, error }] = useImageLoadMutation();
  

  const handleUpload = async () => {
    try {
      setResult(null);
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await loadImage(formData);

      if (response.error) {
        throw new Error('Ошибка при отправке запроса');
      }
  
      const data = response.data;
      setResult(data);
      console.log(data)
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Image Recognition in Keras</h1>
      <h5>Trained with CIFAR-10 dataset</h5>
      <ImageInput 
        file={selectedFile}
        setFile={setSelectedFile}
        setResult={setResult}
      />
      {selectedFile && 
          <button 
            onClick={handleUpload}
            className='upload__button'
          >
            {isLoading ? 'Loading...' : 'Recognize'}
          </button>
      }
      <Result
       data={result} 
       isLoading={isLoading} 
       error={error}
       />
    </div>
  );
};

export default App;
