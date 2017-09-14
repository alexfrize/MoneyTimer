export interface IGoal { 
  _id : string,
  goalTitle : string,
  goalDescription : string,
  goalImageFile : any,
  goalPrice: number,
  percentToSave : number,
  dollarsComplete : number,
  percentComplete : number,
  priority: number
}