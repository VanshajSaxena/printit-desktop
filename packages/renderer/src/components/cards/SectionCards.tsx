import {
  IconClock,
  IconFileCheck,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:to-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-secondary/80 *:data-[slot=card]:from-primary/5 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Volume Metric */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sheets Printed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            842
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Higher volume than yesterday <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total A4/Legal output today
          </div>
        </CardFooter>
      </Card>

      {/* Throughput Metric */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Orders Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            47
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Average 4.2 mins per order <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Jobs cleared via desktop queue
          </div>
        </CardFooter>
      </Card>

      {/* Footfall Metric */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            32
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            6 new users discovered your shop <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Unique PWA scans today</div>
        </CardFooter>
      </Card>

      {/* Efficiency Metric */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Time Saved</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2.4
            <span className="ml-1 text-lg font-normal text-muted-foreground">
              hrs
            </span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reduced counter congestion <IconFileCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Est. manual file handling time saved
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
