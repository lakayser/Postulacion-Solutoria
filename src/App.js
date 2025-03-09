import React, { useEffect, useState } from "react";
import { getToken, getUFdata, saveUFdata } from "./api";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ShowData from "./components/ShowData";

function App() {
  const [token, setToken] = useState("");
  const [ufData, setUfData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const newToken = await getToken();
      setToken(newToken);
      if (newToken) {
        const data = await getUFdata(newToken);
        const filteredData = data.filter(item => item.nombreIndicador === "UNIDAD DE FOMENTO (UF)");
        setUfData(filteredData); 
      }
    };
    fetchData();
  }, []);

  const handleSaveUFData = async () => {
    setLoading(true);
    for (const item of ufData) {
      await saveUFdata(item); 
    }
    setTimeout(() => {
      window.location.reload();
    }, 6000);
  };

  return (
    <BrowserRouter>
      <div>
        <div className='container-fluid'>
          <div className='row mt-3'>
            <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <h1>Token de API</h1>
              <div style={{ maxWidth: "500px", overflowX: "auto" }}>
                <p>{token ? `Token: ${token}` : "Obteniendo token..."}</p>
              </div>        <h2></h2>
              <button onClick={handleSaveUFData} disabled={loading} className='btn btn-dark'>
                {loading ? "Guardando..." : "Guardar Datos de UF desde API"}
              </button>
            </div>
            </div>
          </div>
          </div>
        </div>

        <Routes>
          <Route path='/' element={<ShowData />} />
        </Routes>


    </BrowserRouter>
  );
}

export default App;
