import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Container, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import NewClientForm from './NewClientForm';
import EditClientForm from './EditClientForm';
import PaymentForm from './PaymentForm';
import Summary from './Summary';
import PaymentHistory from './PaymentHistory';
import RenewPlanForm from './RenewPlanForm';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [payingClient, setPayingClient] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [renewingClient, setRenewingClient] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchSummary();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/api/clients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClients(res.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/summary', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSummary(res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleNewClient = (newClient) => {
    setClients([...clients, newClient]);
    setShowNewClientForm(false);
    fetchSummary();
  };

  const handleUpdateClient = (updatedClient) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
    setEditingClient(null);
    fetchSummary();
  };

  const handlePayment = async (clientId, amount) => {
    try {
      await axios.post(`/api/clients/${clientId}/payments`, { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchClients();
      fetchSummary();
      setPayingClient(null);
    } catch (error) {
      console.error('Error registering payment:', error);
    }
  };

  const handleRenewPlan = async (clientId, newAmount, newPlan) => {
    try {
      await axios.post(`/api/clients/${clientId}/renew`, { amount: newAmount, plan: newPlan }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchClients();
      fetchSummary();
      setRenewingClient(null);
    } catch (error) {
      console.error('Error renewing plan:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Summary summary={summary} />
      <Button variant="contained" color="primary" onClick={() => setShowNewClientForm(true)}>
        Nuevo Cliente
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>${client.amount}</TableCell>
                <TableCell>{client.plan}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    onClick={() => setEditingClient(client)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                    onClick={() => setPayingClient(client)}
                  >
                    Registrar Pago
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setShowPaymentHistory(true);
                    }}
                  >
                    Historial
                  </Button>
                  {client.status === 'paid' && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      onClick={() => setRenewingClient(client)}
                    >
                      Renovar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showNewClientForm} onClose={() => setShowNewClientForm(false)}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <NewClientForm onClientAdded={handleNewClient} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingClient} onClose={() => setEditingClient(null)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          {editingClient && (
            <EditClientForm client={editingClient} onClientUpdated={handleUpdateClient} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!payingClient} onClose={() => setPayingClient(null)}>
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogContent>
          {payingClient && (
            <PaymentForm client={payingClient} onPaymentSubmit={handlePayment} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentHistory} onClose={() => setShowPaymentHistory(false)}>
        <DialogTitle>Historial de Pagos</DialogTitle>
        <DialogContent>
          <PaymentHistory clientId={selectedClientId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentHistory(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!renewingClient} onClose={() => setRenewingClient(null)}>
        <DialogTitle>Renovar Plan</DialogTitle>
        <DialogContent>
          {renewingClient && (
            <RenewPlanForm client={renewingClient} onRenewSubmit={handleRenewPlan} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Dashboard;