import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import React from 'react';
// import ReactDOM from 'react-dom/client';
import App from '../App';

import {rest} from "msw";
import {setupServer} from "msw/node"


const server = setupServer(
    rest.get("/predict", (req, res, ctx) =>{
        console.log("predict call mock")
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "guess":
                        [
                            {"name":"hiphop","count":68},
                            {"name":"pop","count":45},
                            {"name":"classical","count":10},
                            {"name":"country","count":4},
                            {"name":"disco","count":4},
                            {"name":"jazz","count":2},
                            {"name":"rock","count":2},
                            {"name":"reggae","count":1}
                        ],
                    "higherGuess":"hiphop",
                    "higherCount":68,
                    "total":136,
                    "message":"success",
                    "rawData":[
                        1,1,1,1,1,1,1,1,1,4,4,7,3,7,4,7,4,7,7,7,4,7,7,7,7,7,7,4,4,4,4,4,4,4,7,4,4,7,4,7,7,7,7,7,7,7,7,4,7,4,4,4,4,7,4,7,7,4,7,7,4,7,4,7,5,2,5,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8,7,2,7,3,7,7,3,9,7,7,7,7,7,7,7,7,7,7,4,7,2,4,4,4,3,4,4,4,4,9,4,4,4,1
                    ]
                }
            )
        )
    })
)

beforeAll(()=> server.listen());
afterAll(()=>server.close());
afterEach(()=>server.resetHandlers());
        
// it('renders without crashing', ()=>{
//     const div = document.createElement('div2');
//     const root = ReactDOM.createRoot(div);
//     root.render(<App/>)
// })

it('renders without crashing', ()=>{
    render(<App/>);
})

it('renders button', ()=>{
    render(<App/>);
    expect(screen.getByText('Submit')).toBeInTheDocument();
})

it('renders input bar', ()=>{
    render(<App/>);
    expect(screen.getByPlaceholderText('youtube link')).toBeInTheDocument();
})

it('does not render result on empty input', async ()=>{
    render(<App/>);
    const search = screen.getByPlaceholderText('youtube link');
    const button = screen.getByText("Submit");
    fireEvent.change(search, {target: {value: 'invalidyoutubestring'}});
    fireEvent.click(button);
    await screen.findByText("invalid URL");
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.getElementById("prediction")).not.toBeInTheDocument();
})

it('renders prediction on valid youtube link', async () => {
    render(<App/>);
    const search = screen.getByPlaceholderText('youtube link');
    const button = screen.getByText("Submit");
    fireEvent.change(search, {target: {value: 'https://www.youtube.com/watch?v=placeholder'}});
    fireEvent.click(button);
    await screen.findByText("Hiphop");
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.body.querySelector("#prediction")).toBeInTheDocument();
})



