import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid 
} from '@material-ui/core';

function RenewPlanForm({ client, onRenewSubmit }) {
  const [formData, setFormData] = useState({
    amount: '',
    plan: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRenewSubmit(client.id, formData.amount, formData.plan);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nuevo Monto"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Nuevo Plan</InputLabel>
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
            Renovar Plan
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default RenewPlanForm;