<form name="search-form" id="search-form">
    <div class="row mb-3">
        <div class="col form-floating">
            <input type="text" class="form-control" id="title-search" name="title-search" placeholder="عنوان و نام مرکز"
                autocomplete="organization-title">
            <label for="title-search">اسم مرکز</label>
        </div>
        <div class="col form-floating">
            <input type="text" class="form-control" id="address-search" name="address-search" placeholder="آدرس مرکز"
                autocomplete="address-line1">
            <label for="address-search">آدرس</label>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="province-search" id="province-search">
                <option disabled selected>انتخاب کنید ...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <label for="province-search">استان</label>
        </div>
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="county-search" id="county-search">
                <option disabled selected>انتخاب کنید ...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <label for="county-search">شهر</label>
        </div>
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="type-search" id="type-search">
                <option disabled selected>انتخاب کنید ...</option>
                @foreach ($types as $type)
                    <option value="{{$type->id}}">{{$type->type_title}}</option>
                @endforeach
            </select>
            <label for="type-search">نوع</label>
        </div>
    </div>
    <button type="submit" id="search-submit" class="btn btn-primary container">جستجو</button>
</form>
