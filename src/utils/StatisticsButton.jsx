import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import CryptoTop10Chart from "../components/CryptoTop10Chart";
import { Close } from "@mui/icons-material";

function SimpleDialog({ onClose, open, data }) {
  const handleClose = () => {
    onClose();
  };

  const top10ByPrice = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((d) => d && d.price_usd != null)
      .sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd))
      .slice(0, 10);
  }, [data]);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth keepMounted>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins, Inter, Roboto, sans-serif",
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          Crypto Statistics
        </Typography>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "#444",
            "&:hover": { color: "#000", backgroundColor: "rgba(0,0,0,0.05)" },
          }}
        >
          <Close fontSize="medium" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 800 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Top 10 by Price (Realtime)
              </Typography>
              <CryptoTop10Chart data={data} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 100 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Acronyms
              </Typography>

              {top10ByPrice.length === 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  No data available.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {top10ByPrice.map((item, idx) => {
                    const symbol = item?.symbol ?? "-";
                    const name = item?.name ?? "-";
                    return (
                      <Box key={symbol || idx}>
                        <ListItem disableGutters sx={{ py: 0.5 }}>
                          <ListItemText
                            primaryTypographyProps={{
                              fontFamily: "Poppins, Inter, Roboto, sans-serif",
                              letterSpacing: 0.3,
                              fontSize: 14,
                            }}
                            primary={`${symbol} - ${name}`}
                          />
                        </ListItem>
                        {idx < top10ByPrice.length - 1 && <Divider sx={{ my: 0.5 }} />}
                      </Box>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

SimpleDialog.PropTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.array,
};

export default function StatisticsButton({ data = [] }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} color="black">
        Statistics
      </Button>

      <SimpleDialog open={open} onClose={handleClose} data={data} />
    </>
  );
}
