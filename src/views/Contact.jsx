import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  EmailOutlined,
  GitHub,
  LinkedIn,
  LocationOnOutlined,
  OpenInNew,
  PictureAsPdf,
  Public,
  WorkOutline,
} from "@mui/icons-material";

const drawerWidth = 240;
const appbarWidth = 70;

export default function Contact() {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        mt: `${appbarWidth}px`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        pb: 4,
      }}
    >
      <Box sx={{ width: "98%" }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 3,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
                background: "linear-gradient(135deg, rgba(0,0,104,0.06) 0%, rgba(0,0,0,0.02) 100%)",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 64, height: 64, fontSize: 28, bgcolor: "#000068" }}>PS</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                    Poornesh Suresh
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Software Development Engineer · Masters in Engineering Management
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                Experienced Software Development Engineer proficient in React.js, JavaScript, and
                UI/UX design, currently pursuing Master’s in Engineering Management.
              </Typography>

              <List dense sx={{ mt: 1 }}>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOnOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Los Angeles, California, United States" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Open to SDE / Front-End Roles" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1, letterSpacing: ".06rem" }}>
                Skill Set
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {[
                  "React.js",
                  "Material UI",
                  "JavaScript",
                  "HTML5",
                  "CSS3",
                  "Bootstrap",
                  "Angular",
                  "Node.js",
                  "REST APIs",
                  "PHP",
                  "MySQL",
                  "Jest / TDD",
                  "Python",
                ].map((s) => (
                  <Chip key={s} label={s} size="small" variant="outlined" />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Get In Touch
              </Typography>

              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<EmailOutlined />}
                  href="mailto:poorneshbs05@gmail.com"
                  sx={{ boxShadow: "none", textTransform: "none" }}
                >
                  Email
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkedIn />}
                  component={Link}
                  sx={{ textTransform: "none" }}
                  href="https://www.linkedin.com/in/poornesh-suresh/"
                  target="_blank"
                  rel="noopener"
                >
                  LinkedIn
                  <OpenInNew sx={{ ml: 0.5 }} fontSize="small" />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHub />}
                  component={Link}
                  sx={{ textTransform: "none" }}
                  href="https://github.com/poornesh-stack"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                  <OpenInNew sx={{ ml: 0.5 }} fontSize="small" />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Public />}
                  component={Link}
                  sx={{ textTransform: "none" }}
                  href="https://poorneshbs05.wixsite.com/poornesh-suresh"
                  target="_blank"
                  rel="noopener"
                >
                  Portfolio
                  <OpenInNew sx={{ ml: 0.5 }} fontSize="small" />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdf />}
                  component={Link}
                  sx={{ textTransform: "none" }}
                  href="./public/Poornesh_Suresh_Resume.pdf"
                  download
                >
                  Resume
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
