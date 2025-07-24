import React from 'react';
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
  Box
} from '@mui/material';
import type { GameType } from '../types/types';
import { GAME_TYPES } from '../constants/constants';

interface ModalsProps {
  openModal: string | null;
  onCloseModal: () => void;
  watchedGameType: GameType;
  primaryColor: string;
  secondaryColor: string;
}

export const Modals: React.FC<ModalsProps> = ({
  openModal,
  onCloseModal,
  watchedGameType,
  primaryColor,
  secondaryColor
}) => {
  const getCurrentGameIcon = () => {
    const gameType = GAME_TYPES.find(g => g.value === watchedGameType);
    return gameType?.icon || "🎮";
  };

  const getCurrentGameLabel = () => {
    const gameType = GAME_TYPES.find(g => g.value === watchedGameType);
    return gameType?.label || "Jeu";
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
      <Dialog open={openModal === 'configure-pin'} onClose={onCloseModal}>
        <DialogTitle>Configurer mon Code PIN</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Définissez un code PIN pour sécuriser la récupération des cadeaux.
          </Typography>
          <TextField
            fullWidth
            label="Code PIN (4 chiffres)"
            type="password"
            inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirmer le Code PIN"
            type="password"
            inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModal}>Annuler</Button>
          <Button variant="contained" onClick={onCloseModal}>
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