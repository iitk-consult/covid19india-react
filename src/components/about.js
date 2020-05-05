import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
}));

function FAQ(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const classes = useStyles();
  

  return (
    <div>
      <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url('http://www.iitkconsult.org/images/entrepreneur-business-corporate-office-wallpaper.jpg')`, marginBottom:0}}>
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={'https://source.unsplash.com/random'} alt={'yo'} />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={9}>
          <div className={classes.mainFeaturedPostContent}>
			<Typography variant="h2" color="inherit" paragraph>
              <strong>IIT KANPUR CONSULTING GROUP</strong>
			</Typography>
            <Typography variant="h3" style={{color:'rgba(255, 255, 255, 0.8)'}} paragraph>
              Using data science and machine learning to provide pro-bono data driven consulting to non-profits and social organisations
            </Typography>
            <Typography variant="h6" color="inherit" paragraph>
              Established in 2018, we at IIT Kanpur Consulting Group are driven by the vision of using data science and case study solving skills to help organizations leverage better insights from their data, and thereby create a strong social impact. Following are the domains we work in:
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
	  <Grid container style={{backgroundColor:'#e0e0e0', paddingTop:60, paddingBottom:60}}>
	  <Grid item md={6}>
	  <Card className={classes.root} variant="outlined" style={{marginLeft: 100}}>
		  <CardHeader
			avatar={
			  <Avatar aria-label="recipe" style={{backgroundColor:'blue'}} className={classes.avatar}>
				1
			  </Avatar>
			}
			titleTypographyProps={{variant:'h4'}}
			title="Environment"
		  />
		  <CardContent style={{marginLeft: 60, marginRight: 60}}>
			<Typography variant="body2" component="p" style={{color:'#555555'}}>
			  Environmental challenges are the primary issues our planet is facing at the moment. We at ICG use various public data to build effective monitoring and predictive models that help the government to identify key sectors to tap in and optimize environmental feasibility of projects.
			  <br /><br />
			</Typography>
		  </CardContent>
	  </Card>
	  </Grid>
	  <Grid item md={6}>
	  <Card className={classes.root} variant="outlined" style={{marginRight: 100}}>
		  <CardHeader
			avatar={
			  <Avatar aria-label="recipe" style={{backgroundColor:'blue'}} className={classes.avatar}>
				2
			  </Avatar>
			}
			titleTypographyProps={{variant:'h4'}}
			title="Healthcare"
		  />
		  <CardContent style={{marginLeft: 60, marginRight: 60}}>
			<Typography variant="body2" component="p" style={{color:'#555555'}}>
			  With growing amount of data available in the healthcare sector, we aim to develop tools and models that accurately predict onset of epidemics and diseases. This domain is full of new possibilities and ICG works for making the world more aware and more accessable in terms of healthcare.
			  <br /><br />
			</Typography>
		  </CardContent>
	  </Card>
	  </Grid>
	  <Grid item md={6}>
	  <Card className={classes.root} variant="outlined" style={{marginLeft: 100}}>
		  <CardHeader
			avatar={
			  <Avatar aria-label="recipe" style={{backgroundColor:'blue'}} className={classes.avatar}>
				3
			  </Avatar>
			}
			titleTypographyProps={{variant:'h4'}}
			title="Business"
		  />
		  <CardContent style={{marginLeft: 60, marginRight: 60}}>
			<Typography variant="body2" component="p" style={{color:'#555555'}}>
			  Our organization offer consulting services to companies, primarily startups that cannot avail services of premier consulting firms. Our model is pro-bono in this context, and our services range from business development strategies to market entry research and much more.
			  <br /><br />
			</Typography>
		  </CardContent>
	  </Card>
	  </Grid>
	  <Grid item md={6}>
	  <Card className={classes.root} variant="outlined" style={{marginRight: 100}}>
		  <CardHeader
			avatar={
			  <Avatar aria-label="recipe" style={{backgroundColor:'blue'}} className={classes.avatar}>
				4
			  </Avatar>
			}
			titleTypographyProps={{variant:'h4'}}
			title="Education"
		  />
		  <CardContent style={{marginLeft: 60, marginRight: 60}}>
			<Typography variant="body2" component="p" style={{color:'#555555'}}>
			  We believe the key to a holistic development of the world begins at better education. We incorporate and build solutions that directly impact the education sector, right from the beginning. In this process, we also extend a hand to those companies, who wish to transform the scenario using technical advancements.
			  <br /><br />
			</Typography>
		  </CardContent>
	  </Card>
	  </Grid>
	  </Grid>
    </div>
  );
}

export default FAQ;