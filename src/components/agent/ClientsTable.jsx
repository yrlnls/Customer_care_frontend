import React from "react";
import { Table, Button, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

function ClientsTable({
  clients = [],
  handleEdit,
  handleDelete,
  serachTerm = "",
  onSearchChange,
}) {
  const safeClients = Array.isArray(clients) ? clients : [];

  const filteredClients = safeClients.filter((client) => {
    const searchLower =serachTerm.toLowerCase();
    return (
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower) ||
      client.address?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div className="position-relative flex-grow-1">
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
            />
          <FormControl
            type="search"
            placeholder="Search clients by name, email, phone, or address..."
            className="ps-5"
            value={serachTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                    >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No clients found matching your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ClientsTable;