import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function PaymentForm({ client, onPaymentSubmit }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPaymentSubmit(client.id, parseFloat(amount));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Monto del Pago"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Registrar Pago
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default PaymentForm;