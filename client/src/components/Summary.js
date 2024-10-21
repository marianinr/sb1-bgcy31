import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';

function Summary({ summary }) {
  if (!summary) return null;

  return (
    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
      <Grid item xs={4}>
        <Paper style={{ padding: '10px', textAlign: 'center' }}>
          <Typography variant="h6">Clientes Activos</Typography>
          <Typography variant="h4">{summary.active_clients}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper style={{ padding: '10px', textAlign: 'center' }}>
          <Typography variant="h6">Vencimientos Hoy</Typography>
          <Typography variant="h4">{summary.due_today}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper style={{ padding: '10px', textAlign: 'center' }}>
          <Typography variant="h6">Clientes en Mora</Typography>
          <Typography variant="h4">{summary.late_clients}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Summary;