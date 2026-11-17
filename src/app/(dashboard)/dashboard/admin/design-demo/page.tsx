"use client";

import { Button, Badge, Card, CardHeader, CardBody, CardFooter, Input } from "@/components/ui";
import { Plus, Search, CheckCircle2, AlertCircle, Users } from "lucide-react";

export default function DesignDemoPage() {
  return (
    <div data-portal="admin" className="portal-root" style={{ padding: 24 }}>
      <h1 style={{ color: "var(--portal-text)", marginBottom: 24 }}>
        Design System Demo — Phase 1
      </h1>

      {/* Buttons */}
      <Card>
        <CardHeader title="Buttons" subtitle="All variants and sizes" />
        <CardBody>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="primary" icon={<Plus size={14} />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD (default)</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </div>
        </CardBody>
      </Card>

      <div style={{ height: 24 }} />

      {/* Badges */}
      <Card>
        <CardHeader title="Badges" subtitle="Status indicators" />
        <CardBody>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
            <Badge variant="error" dot>Failed</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="accent" icon={<Users size={10} />}>Accent</Badge>
          </div>
        </CardBody>
      </Card>

      <div style={{ height: 24 }} />

      {/* Forms */}
      <Card>
        <CardHeader title="Form Inputs" />
        <CardBody>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Student Name" placeholder="Enter name" required />
            <Input label="Email" placeholder="email@example.com" type="email" iconLeft={<Search size={14} />} />
            <Input label="With Error" defaultValue="Wrong input" error="Invalid format" />
            <Input label="With Help" placeholder="Enter phone" help="10-digit number" />
          </div>
        </CardBody>
      </Card>

      <div style={{ height: 24 }} />

      {/* Card with footer */}
      <Card hoverable>
        <CardHeader
          title="Sample Student"
          subtitle="Enrolled in DCA"
          actions={<Badge variant="success" dot>Active</Badge>}
        />
        <CardBody>
          <p>Phone: 9876543210</p>
          <p>Course: Diploma in Computer Applications</p>
          <p>Fees: ₹5,000 (₹3,000 paid)</p>
        </CardBody>
        <CardFooter>
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="primary" size="sm" icon={<CheckCircle2 size={14} />}>
            Mark Present
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}