import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';

export interface Coffee {
  roaster: string;
  name: string;
}

@Service()
export class CoffeeService {
  readonly coffees = httpResource<Coffee[]>(() => '/api/coffees', { defaultValue: [] });
}
