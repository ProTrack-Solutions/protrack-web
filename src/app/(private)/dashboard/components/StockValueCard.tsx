"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function StockValueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Valor em Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-foreground">R$ 85.400</p>
            <p className="text-sm text-muted-foreground">Total investido</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Giro de estoque</span>
              <span className="font-medium">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
