import {
  IconClock,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import { client } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ComponentType } from "react";

function TrendBadge({ change }: { change: number | null | undefined }) {
  if (change == null) return null;

  const isPositive = change > 0;
  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;
  const prefix = isPositive ? "+" : "";

  return (
    <Badge variant="outline">
      <Icon />
      {prefix}
      {change}%
    </Badge>
  );
}

function TrendText({
  change,
  positiveText,
  negativeText,
  neutralText,
  fallbackIcon: FallbackIcon,
}: {
  change: number | null | undefined;
  positiveText: string;
  negativeText: string;
  neutralText: string;
  fallbackIcon?: ComponentType<{ className?: string }>;
}) {
  if (change == null || change === 0) {
    return (
      <>
        {neutralText} {FallbackIcon && <FallbackIcon className="size-4" />}
      </>
    );
  }

  const isPositive = change > 0;
  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;
  const text = isPositive ? positiveText : negativeText;

  return (
    <>
      {text} <Icon className="size-4" />
    </>
  );
}

export function SectionCards() {
  const { data, isLoading, isError } = client.useQuery(
    "get",
    "/api/v1/analytics/dashboard/cards",
    {},
    {
      staleTime: 300_000,
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading || !data || isError) {
    return null;
  }

  return (
    <div className="*:data-[slot=card]:to-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-secondary/80 *:data-[slot=card]:from-primary/5 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sheets Printed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.todaySheets}
          </CardTitle>
          <CardAction>
            <TrendBadge change={data.sheetPercentageChange} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendText
              change={data.sheetPercentageChange}
              positiveText="Higher volume than yesterday"
              negativeText="Lower volume than yesterday"
              neutralText="Volume same as yesterday"
            />
          </div>
          <div className="text-muted-foreground">
            Total A4/Legal output today
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Orders Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.todayOrders}
          </CardTitle>
          <CardAction>
            <TrendBadge change={data.orderPercentageChange} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendText
              change={data.orderPercentageChange}
              positiveText="More orders than yesterday"
              negativeText="Fewer orders than yesterday"
              neutralText="Order volume unchanged"
              fallbackIcon={IconClock}
            />
          </div>
          <div className="text-muted-foreground">
            Jobs cleared via desktop queue
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.todayUsers}
          </CardTitle>
          <CardAction>
            <TrendBadge change={data.userPercentageChange} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.todayNewUsers} new users discovered your shop{" "}
            <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Unique PWA scans today</div>
        </CardFooter>
      </Card>

      {/* <Card className="@container/card"> */}
      {/*   <CardHeader> */}
      {/*     <CardDescription>Time Saved</CardDescription> */}
      {/*     <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
      {/*       2.4 */}
      {/*       <span className="ml-1 text-lg font-normal text-muted-foreground"> */}
      {/*         hrs */}
      {/*       </span> */}
      {/*     </CardTitle> */}
      {/*     <CardAction> */}
      {/*       <Badge variant="outline"> */}
      {/*         <IconTrendingUp /> */}
      {/*         +4.5% */}
      {/*       </Badge> */}
      {/*     </CardAction> */}
      {/*   </CardHeader> */}
      {/*   <CardFooter className="flex-col items-start gap-1.5 text-sm"> */}
      {/*     <div className="line-clamp-1 flex gap-2 font-medium"> */}
      {/*       Reduced counter congestion <IconFileCheck className="size-4" /> */}
      {/*     </div> */}
      {/*     <div className="text-muted-foreground"> */}
      {/*       Est. manual file handling time saved */}
      {/*     </div> */}
      {/*   </CardFooter> */}
      {/* </Card> */}
    </div>
  );
}
