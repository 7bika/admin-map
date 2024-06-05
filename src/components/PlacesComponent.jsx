import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Assuming you created this modal component
import "./placesComponent.css";

const PlacesComponent = () => {
  const [places, setPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:3000/api/places", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlaces(response.data.data.places);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:3000/api/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place._id);
    setEditedName(place.name);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `http://localhost:3000/api/places/${editingPlace}`,
        { name: editedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlaces(
        places.map((place) =>
          place._id === editingPlace ? { ...place, name: editedName } : place
        )
      );

      setEditingPlace(null);
      setEditedName("");
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  const openDeleteModal = (placeId) => {
    setShowDeleteModal(true);
    setPlaceToDelete(placeId);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  const confirmDelete = () => {
    if (placeToDelete) {
      handleDelete(placeToDelete);
      closeDeleteModal();
    }
  };

  return (
    <div className="places-container">
      <h2>Places List</h2>
      <table className="places-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place._id}>
              <td>
                {editingPlace === place._id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  place.name
                )}
              </td>
              <td>
                {editingPlace === place._id ? (
                  <button onClick={handleUpdate}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(place)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => openDeleteModal(place._id)}>
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PlacesComponent;
