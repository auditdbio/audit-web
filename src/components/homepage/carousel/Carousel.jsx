import { Paper, Button, Box, Typography } from "@mui/material";

import Slider from "react-slick";

const Carousel = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};
	var items = [
		{
			name: "Random Name #1",
			description: "Probably the most random thing you have ever seen!",
		},
		{
			name: "Random Name #2",
			description: "Hello World!",
		},
	];

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: "100%",
			}}
		>
			<Typography>Carousel</Typography>
			<div>
				<Slider {...settings}>
					<div style={{ background: "red" }}>
						<h3>11231313123</h3>
					</div>
					<div>
						<h3>2</h3>
					</div>
					<div>
						<h3>3</h3>
					</div>
					<div>
						<h3>4</h3>
					</div>
					<div>
						<h3>5</h3>
					</div>
					<div>
						<h3>6</h3>
					</div>
				</Slider>
			</div>
		</Box>
	);
};

function Item(props) {
	return (
		<Paper>
			<h2>{props.item.name}</h2>
			<p>{props.item.description}</p>

			<Button className="CheckButton">Check it out!</Button>
		</Paper>
	);
}

// function Example(props) {
// 	var items = [
// 		{
// 			name: "Random Name #1",
// 			description: "Probably the most random thing you have ever seen!",
// 		},
// 		{
// 			name: "Random Name #2",
// 			description: "Hello World!",
// 		},
// 	];

// 	return (
// 		<Carousel>
// 			{items.map((item, i) => (
// 				<Item key={i} item={item} />
// 			))}
// 		</Carousel>
// 	);
// }

export default Carousel;
