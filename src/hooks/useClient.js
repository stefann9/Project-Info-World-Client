import { useState } from "react";
import { addClient, checkDuplicateEmail, updateClient, getClient } from "../services/clients";

const defaultClientData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const defaultCarData = {
  make: "",
  model: "",
  year: "",
  engineType: "",
  engineCapacity: "",
  horsepower: "",
  kilowatts: "",
  registrationNumber: "",
  chassisNumber: "",
};

export const useClient = () => {
  const [clientData, setClientData] = useState(defaultClientData);
  const [carsList, setCarsList] = useState([defaultCarData]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleCarChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCarsData = carsList.map((car, i) =>
      i === index ? { ...car, [name]: value } : car
    );
    setCarsList(updatedCarsData);
  };

  const handleAddCar = () => {
    const lastCar = carsList[carsList.length - 1];
    const allValuesNotEmpty = Object.values(lastCar).every((value) => value !== "");
    if (allValuesNotEmpty) {
      setCarsList([...carsList, defaultCarData]);
    } else {
      window.alert("Please fill out all fields for the current car before adding a new one.");
    }
  };

  const handleRemoveCar = (index) => {
    const confirmResponse = window.confirm("Are you sure you want to delete this car?");
    if (confirmResponse === false) return;
    if (carsList.length > 1) {
      const updatedCarsList = carsList.filter((car, i) => i !== index);
      setCarsList(updatedCarsList);
    } else {
      window.alert("Customer must have at least one car");
    }
  };

  const handleGetClient = async (clientID) => {
    try {
      const { firstName, lastName, email, phoneNumber, cars } = await getClient(clientID);
      setClientData({ firstName, lastName, email, phoneNumber });
      setCarsList(cars);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAddClient = async () => {
    try {
      const isDuplicate = await checkDuplicateEmail(clientData.email);
      if (isDuplicate) {
        window.alert("Email address is already registered.");
        return;
      }
      const formData = { ...clientData, cars: carsList };
      await addClient(formData);
      setClientData(defaultClientData);
      setCarsList([defaultCarData]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUpdateClient = async (clientID) => {
    const formData = { ...clientData, cars: carsList };
    try {
      await updateClient(clientID, formData);
      setClientData(defaultClientData);
      setCarsList([defaultCarData]);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    defaultClientData,
    defaultCarData,
    clientData,
    setClientData,
    carsList,
    setCarsList,
    handleClientChange,
    handleCarChange,
    handleAddCar,
    handleRemoveCar,
    handleGetClient,
    handleSubmitAddClient,
    handleSubmitUpdateClient,
  };
};