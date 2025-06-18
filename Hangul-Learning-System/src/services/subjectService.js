import axios from 'axios';
import { API_URL, endpoints } from '../config/api';

const createSubject = async (subjectData) => {
  try {
    const response = await axios.post(`${API_URL}${endpoints.manageSubject.create}`, subjectData);
    const data = response.data;
    // Extract subjectID from the message, e.g., "Subject created successfully with ID: SJ0022"
    const match = data.message.match(/ID: (SJ\d+)/);
    if (match && match[1]) {
      return { subjectID: match[1], ...data }; // Return a consistent object with subjectID
    }
    return data; // Fallback if ID is not found in message
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

const getSubjectById = async (subjectId) => {
  try {
    const response = await axios.get(`${API_URL}${endpoints.manageSubject.getById}${subjectId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateSubject = async (subjectData) => {
  try {
    const response = await axios.put(`${API_URL}${endpoints.manageSubject.update}`, subjectData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const subjectService = {
  createSubject,
  getSubjectById,
  updateSubject,
}; 