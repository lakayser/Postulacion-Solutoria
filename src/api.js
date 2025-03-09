import axios from "axios";

const API_URL = "http://localhost:5000";

const URL = "/api";

export const getToken = async () => {
  try {
    const response = await axios.post(`${URL}/acceso`, {
      userName: "matias.guerrerok@gmail.com",
      flagJson: true,
    });
    console.log("Respuesta de la API:", response.data);
    return response.data.token
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export const getUFdata = async (token) => {
  try {
    const response = await axios.get(`${URL}/indicadores`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Datos de la uf:", response.data)
    return response.data
  } catch (error) {
    console.error("Error:", error)
    return [];
  }
};

export const saveUFdata = async (data) => {
  try {
    
    await axios.post(`${API_URL}/guardarUF`, data); 
    console.log("Dato insertado correctamente:", data);
  } catch (error) {
    console.error("Error guardando en la base de datos:", error);
  }
};



export const fetchUFdata = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerUF`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos desde MySQL:", error);
    return [];
  }
};