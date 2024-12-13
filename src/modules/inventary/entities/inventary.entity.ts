import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Inventary extends Document {
  @Prop({ unique: true, index: true })
  product: string;
  @Prop({ text: true })
  brand: string;
  @Prop({ text: true })
  provider: string;
  @Prop({ text: true })
  category: string;
  @Prop({ Number: true })
  quanty: number;
  @Prop({ text: true })
  unitOfMeasurement: string;
  @Prop({ Number: true })
  lastCost: number;
  @Prop({ Number: true })
  actualCost: number;
  @Prop({ Number: true })
  unitaryCostActually?: number;

  @Prop({ text: true })
  createdAt: string;
  @Prop({ text: true })
  updatedAt?: string;
}

export const InventarySchema = SchemaFactory.createForClass(Inventary);
