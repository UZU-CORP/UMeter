interface IJsonResponse {

    status : boolean;
    data? : any;
    errors? : {[state: string]: string};
    hasNextPage? : boolean;
    numberOfPages? : number;
    nextPage? : number;
    previousPage? : number;

}