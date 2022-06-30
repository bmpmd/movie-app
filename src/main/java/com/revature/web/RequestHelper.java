package com.revature.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.revature.dao.MovieDaoImpl;
import com.revature.models.Movie;
import com.revature.service.MovieService;

public class RequestHelper {

	private static MovieService mserv = new MovieService(new MovieDaoImpl());
	
	public static void addMovie(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		
		response.setContentType("application/json");
		response.addHeader("Access-Control-Allow-Origin", "*");//allow to share resources across diff locations 
		
		System.out.println("in the addMovie method within request helper");

		/**
		 * We're using GSON here because it's easier to use
		 * for parsing a payload.
		 */
		
		//we need to read the body of the request from the front end 
		Gson gson = new Gson();
		gson = new GsonBuilder().create();
		JsonObject payload = new JsonObject();
		
		//json payload... we need to extract that json obj 
		//grab the payload from the request (ITS NOT THE PARAMETERS!)
		JsonParser jsonParser = new JsonParser();
		// parse the payload of the HTTP request 
		JsonElement root = jsonParser.parse(new InputStreamReader((InputStream) request.getInputStream()));
		// Transform payload string to json object
		JsonObject rootobj = root.getAsJsonObject();
		
		System.out.println(rootobj);
		
		// extract properties of JSON object
		String title = rootobj.get("title").getAsString();
		String urlImg = rootobj.get("imageUrl").getAsString();
		int rating = rootobj.get("rating").getAsInt();
		
		
		// construct a movie obj from it and then call the movie's mserv.addmovie(m)
		Movie m = new Movie(title, urlImg, rating);

		// persist movie to DB and get ID
		m = mserv.addMovie(m);
		
		System.out.println("We successfully added the movie: " + m);
		
		// return the persisted movie object to the client
		PrintWriter pw = response.getWriter();
		String json = gson.toJson(m); // this is what we would use Jackson Object Mapper for 
		pw.write(json);
	}
}