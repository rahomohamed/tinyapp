<header>
  <nav class="navbar navbar-expand-md navbar-dark bg-success">
    <a class="navbar-brand" href="/urls">TinyApp</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-item nav-link" href="/urls">My URLs</a>
        <a class="nav-item nav-link" href="/urls/new">Create New URL</a>
      </div>
    </div>
    <div>
     <% if (username) { %> 
      <form action="/logout" method="POST">
         <a>Logged In As: <%= username %>! </a> 
      <input type="submit" value ="Logout" class="btn btn-outline-dark">
     </div>
      <% } else { %>
      <form method="POST" action="/login"><input type="text" placeholder="Username" name="username" required>  
        <input type="submit" value="Login" class="btn btn-outline-dark">
        <% } %>
      </div>
    </div>
      </form>
    </div>
  </nav>
</header>
