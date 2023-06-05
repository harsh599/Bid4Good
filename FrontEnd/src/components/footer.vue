<template>
  <footer class="footer visibility">
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-sm-12 mb-4 mb-md-0">
          <h4>Contact Us</h4>
          <ul class="list-unstyled">
            <li><a href="javascript:void">Email : admin@bidforgood.com</a></li>
            <li><a href="javascript:void">Phone : +1 782 882 4928</a></li>
            <li>
              <a href="javascript:void"
                >Address : Dalhousie University, Halifax, Nova Scotia, Canada
              </a>
            </li>
          </ul>
        </div>
        <div class="col-md-4 col-sm-12 mb-4 mb-md-0">
          <h4>Report Issue</h4>
          <ul class="list-unstyled">
            <li><a href="javascript:void">FAQs</a></li>
            <li><a href="javascript:void">Help Center</a></li>
            <li><a href="/buyer/report-issue">Report a Bug</a></li>
          </ul>
        </div>
        <div class="col-md-4 col-sm-12">
          <h4>About Us</h4>
          <p>
            Bid For Good is a non profit Online Auction portal, we make selling
            easier.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  color: #333;
  padding: 50px 0;
}

.footer h4 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer ul li {
  margin-bottom: 10px;
}

.footer ul li a {
  color: #666;
  font-size: 16px;
  text-decoration: none;
}

@media (max-width: 768px) {
  .footer h4 {
    font-size: 20px;
  }

  .footer ul li a {
    font-size: 14px;
  }
}

.visibility {
  z-index: 100 !important;
  position: relative;
}
</style>
