import { CardIconsKeys as Icons } from "../../Card";

import { ReactComponent as AirCooler } from "./aircooler.svg";
import { ReactComponent as Alarm } from "./alarm.svg";
import { ReactComponent as Bath } from "./bath.svg";
import { ReactComponent as Beer } from "./beer.svg";
import { ReactComponent as Blender } from "./blender.svg";
import { ReactComponent as Boiler } from "./boiler.svg";
import { ReactComponent as BoomBox } from "./boombox.svg";
import { ReactComponent as Car } from "./car.svg";
import { ReactComponent as ClothDryer } from "./clothdryer.svg";
import { ReactComponent as Coffee } from "./coffee.svg";
import { ReactComponent as Computer } from "./computer.svg";
import { ReactComponent as Cooker } from "./cooker.svg";
import { ReactComponent as Crepes } from "./crepes.svg";
import { ReactComponent as DishWasher } from "./dishwasher.svg";
import { ReactComponent as Drone } from "./drone.svg";
import { ReactComponent as EBike } from "./ebike.svg";
import { ReactComponent as Extractor } from "./extractor.svg";
import { ReactComponent as Fan } from "./fan.svg";
import { ReactComponent as Fridge } from "./fridge.svg";
import { ReactComponent as Fryer } from "./fryer.svg";
import { ReactComponent as HairDryer } from "./hairdryer.svg";
import { ReactComponent as HairIron } from "./hairiron.svg";
import { ReactComponent as Heater } from "./heater.svg";
import { ReactComponent as Iron } from "./iron.svg";
import { ReactComponent as Laptop } from "./laptop.svg";
import { ReactComponent as Light } from "./light.svg";
import { ReactComponent as MicroWave } from "./microwave.svg";
import { ReactComponent as Oven } from "./oven.svg";
import { ReactComponent as Phone } from "./phone.svg";
import { ReactComponent as Printer } from "./printer.svg";
import { ReactComponent as Projector } from "./projector.svg";
import { ReactComponent as Saw } from "./saw.svg";
import { ReactComponent as Scooter } from "./scooter.svg";
import { ReactComponent as Screen } from "./screen.svg";
import { ReactComponent as Sewing } from "./sewing.svg";
import { ReactComponent as Shower } from "./shower.svg";
import { ReactComponent as SoundSystem } from "./soundsystem.svg";
import { ReactComponent as Toaster } from "./toaster.svg";
import { ReactComponent as Vacuum } from "./vacuum.svg";
import { ReactComponent as Ventilation } from "./ventilation.svg";
import { ReactComponent as WashingMachine } from "./washing_machine.svg";
import { ReactComponent as Wifi } from "./wifi.svg";

type SVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

type SVGDictionnary = Map<Icons, SVG>;

const svgs: SVGDictionnary = new Map([
  [Icons.AirCooler, AirCooler],
  [Icons.Alarm, Alarm],
  [Icons.Bath, Bath],
  [Icons.Beer, Beer],
  [Icons.Blender, Blender],
  [Icons.Boiler, Boiler],
  [Icons.BoomBox, BoomBox],
  [Icons.Car, Car],
  [Icons.ClothDryer, ClothDryer],
  [Icons.Coffee, Coffee],
  [Icons.Computer, Computer],
  [Icons.Cooker, Cooker],
  [Icons.Crepes, Crepes],
  [Icons.DishWasher, DishWasher],
  [Icons.Drone, Drone],
  [Icons.Cooker, Cooker],
  [Icons.EBike, EBike],
  [Icons.Extractor, Extractor],
  [Icons.Fan, Fan],
  [Icons.Fridge, Fridge],
  [Icons.Fryer, Fryer],
  [Icons.HairDryer, HairDryer],
  [Icons.HairIron, HairIron],
  [Icons.Heater, Heater],
  [Icons.Iron, Iron],
  [Icons.Laptop, Laptop],
  [Icons.Light, Light],
  [Icons.MicroWave, MicroWave],
  [Icons.Oven, Oven],
  [Icons.Phone, Phone],
  [Icons.Printer, Printer],
  [Icons.Projector, Projector],
  [Icons.Saw, Saw],
  [Icons.Scooter, Scooter],
  [Icons.Screen, Screen],
  [Icons.Sewing, Sewing],
  [Icons.Shower, Shower],
  [Icons.SoundSystem, SoundSystem],
  [Icons.Toaster, Toaster],
  [Icons.Vacuum, Vacuum],
  [Icons.Ventilation, Ventilation],
  [Icons.WashingMachine, WashingMachine],
  [Icons.Wifi, Wifi],
]);

export default svgs;
