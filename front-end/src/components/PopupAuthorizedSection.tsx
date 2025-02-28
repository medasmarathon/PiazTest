import useAuth from "@/hooks/useAuth";
import { Box, Button, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { ReactNode } from "react";

export default function AuthorizedSection({ children }: { children: ReactNode | ReactNode[]}) {
  const { isLogin, inProgress, userEmail, googleSignIn } = useAuth();

  if (!isLogin) {
    return (
      <Box sx={{ width: 300, p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => googleSignIn()}
          startIcon={<GoogleIcon />}
        >
          {inProgress && <CircularProgress />}
          Sign in with Google
        </Button>
      </Box>
    );
  }

  return (
    <>{children}</>
  )
}
