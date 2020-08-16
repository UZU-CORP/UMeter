interface IJsonResponse {

    status : boolean;
    data? : any;
    error? : any;
    hasNextPage? : boolean;
    numberOfPages? : number;
    nextPage? : number;
    previousPage? : number;

}