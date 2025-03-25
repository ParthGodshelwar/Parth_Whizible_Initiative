import Box from "@mui/material/Box";
import { Small } from "app/components/Typography";
import { WhizProgressBar, SimpleCard } from "app/components";

export default function Campaigns() {
  return (
    <Box>
      <SimpleCard title="Campaigns">
        <Small color="text.secondary">Today</Small>
        <WhizProgressBar value={75} color="primary" text="Google (102k)" />
        <WhizProgressBar value={45} color="secondary" text="Twitter (40k)" />
        <WhizProgressBar value={75} color="primary" text="Tensor (80k)" />

        <Small color="text.secondary" display="block" pt={4}>
          Yesterday
        </Small>
        <WhizProgressBar value={75} color="primary" text="Google (102k)" />
        <WhizProgressBar value={45} color="secondary" text="Twitter (40k)" />
        <WhizProgressBar value={75} color="primary" text="Tensor (80k)" />

        <Small color="text.secondary" display="block" pt={4}>
          Yesterday
        </Small>
        <WhizProgressBar value={75} color="primary" text="Google (102k)" />
        <WhizProgressBar value={45} color="secondary" text="Twitter (40k)" />
        <WhizProgressBar value={75} color="primary" text="Tensor (80k)" />
      </SimpleCard>
    </Box>
  );
}
