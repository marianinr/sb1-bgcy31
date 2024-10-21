import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid 
} from '@material-ui/core';

function EditClientForm({ client, onClientUpdated }) {
  const [formData, setFormData] = useState({
    name: client.name,
    address: client.address,
    phone: client.phone,
    amount: client.amount,
    plan: client.plan
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/clients/${client.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onClientUpdated({ ...client, ...formData });
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Monto"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Plan</InputLabel>
            <Select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
            >
              <MenuItem value="White">White (4 semanas, 60% interés)</MenuItem>
              <MenuItem value="Red">Red (8 semanas, 90% interés)</MenuItem>
              <MenuItem value="Black">Black (12 semanas, 150% interés)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Actualizar Cliente
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default EditClientForm;