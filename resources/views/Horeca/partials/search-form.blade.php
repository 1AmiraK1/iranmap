<form name="search-form" id="search-form">
    <div class="row mb-3">
        <div class="col form-floating">
            <input type="text" class="form-control" id="title" name="title" placeholder="عنوان و نام مرکز" autocomplete="organization-title">
            <label for="title">اسم مرکز</label>
        </div>
        <div class="col form-floating">
            <input type="text" class="form-control" id="address" name="address" placeholder="آدرس مرکز" autocomplete="address-line1">
            <label for="address">آدرس</label>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col">
            <select class="form-select" aria-label="Default select example" name="province">
                <option selected>استان</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div>
        <div class="col">
            <select class="form-select" aria-label="Default select example" name="county">
                <option selected>شهر</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div>
        <div class="col">
            <select class="form-select" aria-label="Default select example" name="type">
                <option selected>نوع</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div>
    </div>
            <button type="submit" id="search-submit" class="btn btn-primary container">جستجو</button>
</form>
