# Minesweeper Multipage Webserver

  

This is a HW-exercise from my professor after [this](https://web1.hszg.de/scheder-lehre/WE-I/lecture-notes/04-02-static-server.html)class. The goal is to implement minesweeper using **only** static pages without saving any data on the server. This means usage of ``<button>`` and ``<input>`` is impossible. The only things i can work with are the ``request-url`` and ``<a>`` for interactibility. 


The main idea behind my implementation is to split the ``request-url`` into differnt tokens.
First extracting general settings like gameType, seed and tool followed by an abitrary list of actions
```
game:seed:tool [action.x.y]
``` 


  
  
  
  
  

### sample url for a solved mid difficulty game

  
  

http://localhost:3001/minesweeper:mid:317:search-s.0.0-f.0.3-f.5.0-s.0.4-s.0.5-f.3.5-f.4.9-s.4.10-s.5.9-s.4.11-s.5.11-s.5.10-s.3.11-s.6.9-s.6.8-s.6.10-s.5.12-s.3.12-f.4.12-f.6.12-f.7.8-s.4.5-s.5.5-f.6.7-s.7.7-s.8.8-s.9.8-s.8.7-s.9.7-s.8.6-s.7.6-s.9.6-f.6.6-s.6.5-f.6.4-s.7.5-s.7.4-s.6.3-s.6.2-s.7.2-s.7.3-s.8.3-s.8.2-s.8.4-s.9.5-s.9.4-s.10.4-s.10.5-f.10.2-f.9.3-s.9.2-s.9.1-s.8.1-s.6.0-f.6.1-f.12.0-f.13.6-f.10.7-f.8.5-s.10.8-s.10.9-s.11.7-s.11.8-s.12.7-s.12.8-s.13.7-s.13.8-s.13.0-s.14.1-s.14.0-s.14.2-f.15.10-s.15.11-f.14.3-f.15.3-s.11.10-s.11.11-s.10.11-f.10.10-f.11.9-f.2.11-f.1.11-f.0.11-s.2.12-s.10.12-f.11.12-f.12.12-s.13.12-s.14.12-f.15.12-f.15.2-f.15.0-s.15.1-s.15.13-s.14.13-s.14.14-s.13.14-s.13.13-s.15.14-s.12.13-s.12.14-s.11.13-s.11.14-f.14.15-f.13.15-s.12.15-s.11.15-s.15.15-s.9.13-s.8.13-f.10.13-f.7.13-s.6.13-s.6.14-s.5.14-s.5.13-s.7.14-s.4.13-s.4.14-s.3.13-s.3.14-f.2.13-s.2.14-s.2.15-s.1.12-f.0.12-f.4.15-f.5.15-s.6.15-s.7.15-f.8.14-f.9.15-s.9.14-s.8.15


