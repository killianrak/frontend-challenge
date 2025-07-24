import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import type { GameType } from '../types/types';
import { GAME_TYPES } from '../constants/constants';

interface ModalsProps {
  openModal: string | null;
  onCloseModal: () => void;
  onPinConfigured: (pin: string) => void;
  watchedGameType: GameType;
  primaryColor: string;
  secondaryColor: string;
}

export const Modals: React.FC<ModalsProps> = ({
  openModal,
  onCloseModal,
  onPinConfigured,
  watchedGameType,
  primaryColor,
  secondaryColor
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const getCurrentGameIcon = () => {
    const gameType = GAME_TYPES.find(g => g.value === watchedGameType);
    return gameType?.icon || "🎮";
  };

  const getCurrentGameLabel = () => {
    const gameType = GAME_TYPES.find(g => g.value === watchedGameType);
    return gameType?.label || "Jeu";
  };

  const handlePinSubmit = () => {
    // Validation du PIN
    if (pin.length !== 4) {
      setPinError('Le code PIN doit contenir 4 chiffres');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setPinError('Le code PIN doit contenir uniquement des chiffres');
      return;
    }

    if (pin !== confirmPin) {
      setPinError('Les codes PIN ne correspondent pas');
      return;
    }

    // PIN valide, on le sauvegarde
    onPinConfigured(pin);
    
    // Reset des champs
    setPin('');
    setConfirmPin('');
    setPinError('');
  };

  const handleClosePinModal = () => {
    // Reset des champs quand on ferme
    setPin('');
    setConfirmPin('');
    setPinError('');
    onCloseModal();
  };

  return (
    <>
      {/* PIN Modal */}
      <Dialog open={openModal === 'pin'} onClose={onCloseModal}>
        <DialogTitle>Mon Code PIN</DialogTitle>
        <DialogContent>
          <Typography>Configuration du code PIN...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={openModal === 'qr'} onClose={onCloseModal}>
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent>
          <Typography>QR Code de la campagne...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Configure PIN Modal */}
      <Dialog open={openModal === 'configure-pin'} onClose={handleClosePinModal}>
        <DialogTitle>Configurer mon Code PIN</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Définissez un code PIN pour sécuriser la récupération des cadeaux.
          </Typography>
          
          {pinError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pinError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Code PIN (4 chiffres)"
            type="number"
            value={pin}
            onChange={(e) => {
              const value = e.target.value.slice(0, 4); // Limite à 4 caractères
              setPin(value);
              setPinError(''); // Reset l'erreur quand on tape
            }}
            inputProps={{ 
              maxLength: 4,
              pattern: "[0-9]*",
              inputMode: "numeric"
            }}
            sx={{ mb: 2 }}
            error={!!pinError}
          />
          <TextField
            fullWidth
            label="Confirmer le Code PIN"
            type="number"
            value={confirmPin}
            onChange={(e) => {
              const value = e.target.value.slice(0, 4); // Limite à 4 caractères
              setConfirmPin(value);
              setPinError(''); // Reset l'erreur quand on tape
            }}
            inputProps={{ 
              maxLength: 4,
              pattern: "[0-9]*",
              inputMode: "numeric"
            }}
            error={!!pinError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePinModal}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handlePinSubmit}
            disabled={!pin || !confirmPin}
          >
            Configurer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={openModal === 'preview'} onClose={onCloseModal} maxWidth="md">
        <DialogTitle>Aperçu du jeu</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Aperçu de votre {getCurrentGameLabel()}
            </Typography>
            <Box
              sx={{
                width: 300,
                height: 300,
                mx: 'auto',
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              {getCurrentGameIcon()}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Couleurs: {primaryColor} • {secondaryColor}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Condition Modal */}
      <Dialog open={openModal === 'edit-condition'} onClose={onCloseModal}>
        <DialogTitle>Modifier les conditions</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Définissez les conditions spécifiques pour ce gain.
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de condition</InputLabel>
            <Select defaultValue="none">
              <MenuItem value="none">Aucune condition</MenuItem>
              <MenuItem value="min-purchase">Achat minimum</MenuItem>
              <MenuItem value="time-limit">Limite de temps</MenuItem>
              <MenuItem value="quantity-limit">Limite de quantité</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Valeur de la condition"
            placeholder="Ex: 10€, 24h, 1 par client..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Annuler</Button>
          <Button variant="contained" onClick={onCloseModal}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};